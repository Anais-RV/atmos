from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
import uuid
from datetime import timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

User = get_user_model()

class PasswordResetToken(models.Model):
    """
    Modelo para almacenar tokens de recuperacion de contraseñas.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="password_reset_tokens"
    )
    token = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Token de Recuperación de Contraseña"
        verbose_name_plural = "Tokens de Recuperación de Contraseña"

    def __str__(self):
        return f"Token para {self.user.email} - {'Usado' if self.is_used else 'Activo'}"
    
    def save(self, *args, **kwargs):
        # Si no está definida, establecer expiración de 24 horas.
        if not self.expires_at:
            timeout_hours = getattr(
                settings,
                'PASSWORD_RESET_TIMEOUT_HOURS',
                24
            )
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)

    def is_valid(self):
        """
        Verifica si el token es válido (no usado y no expirado).
        """
        if self.is_used:
            return False
        if timezone.now() > self.expires_at:
            return False
        return True
    
    def mark_as_used(self):
        """
        Marca el token como usado
        """
        self.is_used = True
        self.save()

    @classmethod
    def invalidate_user_tokens(cls, user):
        """
        Invalida todos los tokens activos de un usuario
        """
        cls.objects.filter(user=user, is_used=False).update(is_used=True)

class UserPreferences(models.Model):
    """
    Modelo para almacenar las preferencias de usuario.
    Relación OneToOne con el modelo User.
    """

    # Elecciones para el tema
    THEME_CHOICES = [
        ("light", "Claro"),
        ("dark", "Oscuro"),
    ]

    # Elecciones para el idioma
    LANGUAGE_CHOICES = [
        ("es", "Español"),
        ("en", "Inglés"),
        ("fr", "Francés"),
        ("ru", "Ruso"),
    ]

    # Relación OneToOne con User
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="preferences",
        verbose_name="Usuario",
    )

    # Campos de preferencias
    theme = models.CharField(
        max_length=10,
        choices=THEME_CHOICES,
        default="light",
        verbose_name="Tema",
    )

    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default="es",
        verbose_name="Idioma",
    )

    favourite_weather_station = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Estación Metereológica Favorita",
    )

    # Campos de auditoría
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de Creación",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Última actualización",
    )

    class Meta:
        verbose_name = 'Preferencia de Usuario'
        verbose_name_plural = 'Preferencias de Usuarios'
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Preferencias de {self.user.username}"
    
    @classmethod
    def get_or_create_for_user(cls, user):
        """
        Obtiene o crea las preferencias para un usuario.
        """
        preferences, created = cls.objects.get_or_create(
            user=user,
            defaults={
                'theme': 'light',
                'language': 'es',
            }
        )
        return preferences

# Signals para crear automáticamente las preferencias al crear un usuario
@receiver(post_save, sender=User)
def create_user_preferences(sender, instance, created, **kwargs):
    """
    Signal que crea automáticamente las preferencias cuando se crea un usuario.
    """
    if created:
        UserPreferences.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_preferences(sender, instance, **kwargs):
    """
    Signal que guarda las preferencias cuando se guarda el usuario.
    """
    if hasattr(instance, 'preferences'):
        instance.preferences.save()