from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
import uuid
from datetime import timedelta

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
    modelo para almacenar preferencias del usuario (idioma, tema, estacion favorita).
    """
    LANGUAGE_CHOICES = [
        ('es', 'Español'),
        ('en', 'English'),
        ('fr', 'Français'),
        ('de', 'Deutsch'),
    ]

    THEME_CHOICES = [
        ('light', 'Claro'),
        ('dark', 'Oscuro'),
        ('auto', 'Automatico'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="preferences"
    )
    language = models.CharField(
        max_length=5,
        choices=LANGUAGE_CHOICES,
        default='es'
    )
    theme = models.CharField(
        max_length=10,
        choices=THEME_CHOICES,
        default='light'
    )
    favorite_station = models.IntegerField(
        null=True,
        blank=True,
        help_text="ID de la estacion meteorologica favorita"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Preferencia de Usuario"
        verbose_name_plural = "Preferencias de Usuario"

    def __str__(self):
        return f"Preferencias de {self.user.username}"