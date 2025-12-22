from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings
from rest_framework import exceptions
from .documents import UserDocument


class UserAdapter:
    """Light adapter exposing attributes SimpleJWT expects."""
    def __init__(self, doc):
        self._doc = doc
        self.id = doc.id
        self.pk = doc.id
        self.username = getattr(doc, 'username', None)
        self.email = getattr(doc, 'email', None)
        self.is_active = getattr(doc, 'is_active', True)
        self.is_staff = getattr(doc, 'is_staff', False)
        self.is_superuser = getattr(doc, 'is_superuser', False)

    def __str__(self):
        return self.username or str(self.pk)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False


class MongoJWTAuthentication(JWTAuthentication):
    """JWT auth class that looks up users in MongoEngine documents."""

    def get_user(self, validated_token):
        # Determine which claim holds the user id. Prefer class attribute if present,
        # otherwise fall back to SimpleJWT settings.
        claim = getattr(self, 'user_id_claim', api_settings.USER_ID_CLAIM)
        user_id = validated_token.get(claim)
        if user_id is None:
            # last resort: try common claim name
            user_id = validated_token.get('user_id')
        if user_id is None:
            raise exceptions.AuthenticationFailed('Token contained no recognizable user identification')

        try:
            user_doc = UserDocument.objects.get(id=int(user_id))
        except Exception:
            raise exceptions.AuthenticationFailed('User not found')

        if not getattr(user_doc, 'is_active', True):
            raise exceptions.AuthenticationFailed('User is inactive')

        return UserAdapter(user_doc)
