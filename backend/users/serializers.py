from django.contrib.auth.models import User
from django.core.validators import validate_email
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import PasswordResetToken

# Devolvemos el modelo del usuario activo:
User = get_user_model() 

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2")
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_email(self, value):
        validate_email(value)
        if User.objects.filter(email=value).exists():
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
        user = User(
            username=validated_data["username"],
            email=validated_data.get("email", "")
        )
        user.set_password(validated_data["password"]) # Hashea la contraseña
        # Guardamos los cambios en user y lo retornamos
        user.save()
        return user



class ProfileSerializer(serializers.ModelSerializer):
    """Serializer para visualizar el perfil."""

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        read_only_fields = ["id", "username"]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer exclusivo para actualización del usuario."""

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name"]
        extra_kwargs = {
            "email": {"required": True},
        }

    def validate_email(self, value):
        validate_email(value)
        user = self.context["request"].user

        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
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
            # Buscar usuario por email
            from django.contrib.auth import get_user_model
            User = get_user_model()

            try:
                user = User.objects.get(email=email)
                username = user.username
            except User.DoesNotExist:
                raise serializers.ValidationError('Credenciales incorrectas')
            
            # Usar authenticate() para verificar credenciales
            user = authenticate(username=username, password=password)

            if user is None:
                raise serializers.ValidationError(
                    'Credenciales inválidas',
                    code='authentication_failed'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'Esta cuenta ha sido desactivada',
                    code='account_disabled'
                )

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
        if not user.check_password(value):
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
        user = self.context["request"].user
        # Usar set_password() para hashear la nueva contraseña
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
    
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

        try:
            user = User.objects.get(email=value)

            # Verificar que el usuario esté activo
            if not user.is_active:
                raise serializers.ValidationError(
                    "Esta cuenta ha sido desactivada"
                )
            
            # Guardar el usuario para uso posterior
            self.context["user"] = user

        except User.DoesNotExist:
            # Por seguridad, NO revelamos si el email existe
            # Pero guardamos None para manejarlo después
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
        
        # Invalidar tokens anteriores del usuario
        PasswordResetToken.invalidate_user_tokens(user)

        # Crear nuevo token
        reset_token = PasswordResetToken.objects.create(user=user)

        # Enviar email
        self._send_reset_email(user, reset_token)

        return reset_token
    
    