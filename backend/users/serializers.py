from django.core.validators import validate_email
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from users.documents import UserDocument, PasswordResetTokenDocument
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .documents import UserPreferencesDocument
from .errors import PasswordResetError
from django.utils import timezone
from .documents import get_next_sequence

User = UserDocument

class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    def validate_email(self, value):
        validate_email(value)
        if User.objects(email=value).first():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value
    
    def validate_password(self, value):
        """
        Valida la contraseña usando los validadores de Django.
        Eso asegura que umple con los requisitos de seguridad.
        """
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate(self, attrs):
        """Verifica si las contraseñas coinciden"""
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return attrs

    def create(self, validated_data):
        """
        Crea el usuario usando set_password() para hashear la contraseña.
        """
        # Eliminar password2 ya que ha cumplido con su función
        validated_data.pop("password2")

        # Método 1: Usando create_user 
        # create_user usa set_password() internamente
        # return User.objects.create_user(
        #    username=validated_data["username"],
        #    email=validated_data.get("email", ""),
        #    password=validated_data["password"], # <-- Encripta la contraseña automáticamente
        # )
    
        # Método 2: Manual
        # Create MongoEngine document
        pwd = make_password(validated_data["password"])
        # assign an incremental integer id using counters collection
        next_id = get_next_sequence('users')
        user_doc = UserDocument(
            id=next_id,
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=pwd,
        )
        user_doc.save()
        return user_doc



class ProfileSerializer(serializers.Serializer):
    """Serializer para visualizar el perfil."""
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField()
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    def to_representation(self, instance):
        # instance may be UserDocument
        return {
            'id': getattr(instance, 'id', None),
            'username': getattr(instance, 'username', None),
            'email': getattr(instance, 'email', None),
            'first_name': getattr(instance, 'first_name', None),
            'last_name': getattr(instance, 'last_name', None),
        }


class ProfileUpdateSerializer(serializers.Serializer):
    """Serializer exclusivo para actualización del usuario."""
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        validate_email(value)
        user = self.context['request'].user
        # check if another user has same email
        existing = UserDocument.objects(email=value).first()
        if existing and int(existing.id) != int(user.pk):
            raise serializers.ValidationError("Este correo ya está en uso.")
        return value

    def to_representation(self, instance):
        return ProfileSerializer(instance).data

# Añadido serializer para login
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            # Buscar usuario por email en MongoEngine
            user = UserDocument.objects(email=email).first()
            if not user:
                raise serializers.ValidationError('Credenciales incorrectas')
            if not getattr(user, 'is_active', True):
                raise serializers.ValidationError('Esta cuenta ha sido desactivada')
            # Verificar contraseña
            if not user.check_password(password):
                raise serializers.ValidationError('Credenciales inválidas', code='authentication_failed')
            data['user'] = user
        
        else:
            raise serializers.ValidationError('Debe proporcionar email y contraseña')
        
        return data

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    new_password2 = serializers.CharField(write_only=True, required=True)

    def validate_old_password(self, value):
        """Verifica que la contraseña actual sea correcta"""
        user = self.context["request"].user
        # user may be adapter; fetch UserDocument
        from users.documents import UserDocument
        user_doc = UserDocument.objects(id=int(user.pk)).first()
        if not user_doc or not user_doc.check_password(value):
            raise serializers.ValidationError('La contraseña actual es incorrecta')
        return value
    
    def validate_new_password(self, value):
        """Valida la nueva contraseña"""
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def validate(self, attrs):
        """Verifica que las nuevas contraseñas coincidan"""
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({
                "new_password2": "Las contraseñas no coinciden"
            })
        
        # Verificar si la nueva contraseña sea diferente a la antigua
        if attrs["old_password"] == attrs["new_password"]:
            raise serializers.ValidationError({
                "new_password": "La nueva contraseña debe ser diferente a la vieja contraseña."
            })
        
        return attrs
    
    def save(self):
        """Actualiza la contraseña del usuario"""
        user = self.context['request'].user
        from users.documents import UserDocument
        user_doc = UserDocument.objects(id=int(user.pk)).first()
        user_doc.password = make_password(self.validated_data['new_password'])
        user_doc.save()
        return user_doc
    
class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer para solicitar recuperación de contraseña.
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """
        Valida que el email existe en el sistema
        """
        # Normalizar email (convertir a minúsculas)
        value = value.lower().strip()

        user = UserDocument.objects(email=value).first()
        if user and not getattr(user, 'is_active', True):
            raise serializers.ValidationError("Esta cuenta ha sido desactivada")
        self.context["user"] = user
        
        return value
    
    def _send_reset_email(self, user, reset_token):
        """
        Envía el email de recuperación de contraseña.
        """
        # Construir URL de restablecimiento
        reset_url = f"{settings.FRONTEND_URL}/password-reset/{reset_token.token}"
        
        # Contexto para el template
        context = {
            'user': user,
            'reset_url': reset_url,
            'expiration_hours': 24,
        }
        
        # Renderizar template HTML
        html_message = render_to_string(
            'emails/password_reset.html',
            context
        )
        
        # Versión en texto plano
        plain_message = strip_tags(html_message)
        
        # Enviar email
        send_mail(
            subject='Recuperación de Contraseña',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
    
    def save(self):
        """
        Genera el token y envía el email.
        """
        user = self.context.get("user")

        # Si el usuario no existe, no hacemos nada
        # (por seguridad, no revelamos que el email no existe)
        if user is None:
            return None
        
        if user is None:
            return None

        # Invalidate previous tokens
        PasswordResetTokenDocument.invalidate_user_tokens(user.id)

        import uuid
        from datetime import datetime, timedelta
        token_str = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=24)
        reset_token = PasswordResetTokenDocument(
            user_id=user.id,
            token=token_str,
            expires_at=expires_at
        )
        reset_token.save()

        # send email (we keep same _send_reset_email method expecting a user-like object)
        self._send_reset_email(user, reset_token)

        return reset_token
    
class PasswordResetVerifySerialzer(serializers.Serializer):
    """
    Serializer para verificar un token de recuperación.
    """
    token = serializers.UUIDField(required=True)

    def validate_token(self, value):
        """
        Valida que el token existe y es válido.
        """
        reset_token = PasswordResetTokenDocument.objects(token=str(value)).first()
        if not reset_token:
            raise serializers.ValidationError("Enlace de recuperación inválido")
        if not reset_token.is_valid():
            if reset_token.is_used:
                raise serializers.ValidationError("Este enlace ya ha sido utilizado.")
            else:
                raise serializers.ValidationError("Este enlace ha expirado.")
        self.context["reset_token"] = reset_token
        
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer para confirmar el cambio de contraseña
    """
    token = serializers.UUIDField(required=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        style={"input_type": "password"}
    )
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={"input_type": "password"}
    )

    def validate_token(self, value):
        """
        Valida que el token existe y es válido
        """
        # Use the MongoEngine document for tokens
        token_str = str(value)
        reset_token = PasswordResetTokenDocument.objects(token=token_str).first()

        if not reset_token:
            raise serializers.ValidationError({
                "code": PasswordResetError.TOKEN_INVALID,
                "message": "Enlace de recuperación inválido."
            })

        if reset_token.is_used:
            raise serializers.ValidationError({
                "code": PasswordResetError.TOKEN_USED,
                "message": "Este enlace ya ha sido utilizado."
            })

        from datetime import datetime
        if datetime.utcnow() > reset_token.expires_at:
            raise serializers.ValidationError({
                "code": PasswordResetError.TOKEN_EXPIRED,
                "message": "Este enlace ha expirado."
            })

        self.context["reset_token"] = reset_token
        return value

    def validate_new_password(self, value):
        """
        Valida la nueva contraseña usando los validadores de Django.
        """
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def validate(self, data):
        """
        Valida que las contraseñas coincidan
        """
        if data["new_password"] != data["new_password_confirm"]:
            raise serializers.ValidationError({
                "new_password_confirm": "Las contraseñas no coinciden"
            })
        return data
    
    def save(self):
        """
        Cambia la contraseña del usuario y marca el token como usado
        """
        reset_token = self.context["reset_token"]
        user = UserDocument.objects(id=reset_token.user_id).first()
        if not user:
            raise serializers.ValidationError('Usuario no encontrado')

        user.password = make_password(self.validated_data["new_password"])
        user.save()

        reset_token.mark_as_used()
        PasswordResetTokenDocument.invalidate_user_tokens(user.id)

        return user


class UserPreferencesSerializer(serializers.Serializer):
    """
    Serializer para las preferencias de usuario.
    Incluye validación de choices y campos personalizados.
    """

    # Fields for embedded preferences document
    theme = serializers.CharField()
    language = serializers.CharField()
    favourite_weather_station = serializers.CharField(allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def validate_theme(self, value):
        """
        Valida que el tema sea uno de los permitidos.
        """
        allowed_themes = ['light', 'dark']
        
        if value not in allowed_themes:
            raise serializers.ValidationError(
                f'Tema inválido. Valores permitidos: {", ".join(allowed_themes)}'
            )
        
        return value
    
    def validate_language(self, value):
        """
        Valida que el idioma sea uno de los permitidos.
        """
        allowed_languages = ['es', 'en', 'fr']
        
        if value not in allowed_languages:
            raise serializers.ValidationError(
                f'Idioma inválido. Valores permitidos: {", ".join(allowed_languages)}'
            )
        
        return value
    
    def validate_favorite_weather_station(self, value):
        """
        Valida la estación meteorológica favorita.
        """
        if value is not None and len(value) > 100:
            raise serializers.ValidationError(
                'El nombre de la estación no puede exceder 100 caracteres'
            )
        
        return value
    
    def validate(self, data):
        """
        Validación adicional a nivel de objeto.
        """
        # Aquí puedes añadir validaciones que involucren múltiples campos
        return data
    
    def to_representation(self, instance):
        """
        Personaliza la representación de salida.
        """
        # instance may be EmbeddedDocument or dict
        def _get(inst, attr):
            if inst is None:
                return None
            # prefer attribute access for EmbeddedDocument
            if hasattr(inst, attr):
                return getattr(inst, attr)
            # if it's a dict-like, try get
            try:
                return inst.get(attr)
            except Exception:
                return None

        data = {
            'theme': _get(instance, 'theme'),
            'language': _get(instance, 'language'),
            'favourite_weather_station': _get(instance, 'favourite_weather_station'),
            'created_at': _get(instance, 'created_at'),
            'updated_at': _get(instance, 'updated_at'),
        }
        data['theme_display'] = data['theme']
        data['language_display'] = data['language']
        return data
    
class UserPreferencesUpdateSerializer(serializers.Serializer):
    """
    Serializer específico para actualizaciones parciales (PATCH).
    Todos los campos son opcionales.
    """
    
    theme = serializers.CharField(required=False)
    language = serializers.CharField(required=False)
    favourite_weather_station = serializers.CharField(required=False, allow_null=True)

    def validate_theme(self, value):
        """Validación de tema"""
        allowed_themes = ['light', 'dark']
        if value not in allowed_themes:
            raise serializers.ValidationError(
                f'Tema inválido. Valores permitidos: {", ".join(allowed_themes)}'
            )
        return value
    
    def validate_language(self, value):
        """Validación de idioma"""
        allowed_languages = ['es', 'en', 'fr']
        if value not in allowed_languages:
            raise serializers.ValidationError(
                f'Idioma inválido. Valores permitidos: {", ".join(allowed_languages)}'
            )
        return value
    
    def validate_favorite_weather_station(self, value):
        """Validación de estación meteorológica"""
        if value is not None and len(value) > 100:
            raise serializers.ValidationError(
                'El nombre de la estación no puede exceder 100 caracteres'
            )
        return value


class TagSerializer(serializers.Serializer):
    """
    Serializer para etiquetas de usuario.
    """
    # Serializer for TagDocument
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    color = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El nombre no puede estar vacío")
        if len(value) > 50:
            raise serializers.ValidationError("El nombre no puede exceder 50 caracteres")
        return value.strip()

    def validate_color(self, value):
        import re
        if not re.match(r'^#[0-9A-Fa-f]{6}$', value):
            raise serializers.ValidationError("El color debe ser un código hex válido (ej: #3b82f6)")
        return value

    def update(self, instance, validated_data):
        """Update an existing TagDocument instance."""
        # instance is expected to be a TagDocument
        if not instance:
            raise serializers.ValidationError('Instancia de etiqueta no encontrada')

        name = validated_data.get('name', getattr(instance, 'name', None))
        color = validated_data.get('color', getattr(instance, 'color', None))

        if name is not None:
            instance.name = name
        if color is not None:
            instance.color = color

        instance.save()
        return instance
    