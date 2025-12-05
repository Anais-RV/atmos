from django.contrib.auth.models import User
from django.core.validators import validate_email
from rest_framework import serializers


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

