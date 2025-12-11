from django.contrib.auth.models import User
from django.core.validators import validate_email
from rest_framework import serializers
from django.contrib.auth import authenticate


class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

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

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )


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
