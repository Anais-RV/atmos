from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import login
from django.conf import settings

from .serializers import (
    UserRegisterSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    LoginSerializer,
)
from .permissions import IsSuperUser

# Solo importar FWT si está disponible
try:
    from rest_framework_simplejwt.tokens import RefreshToken
    JWT_AVAILABLE = True
except ImportError:
    JWT_AVAILABLE = False


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        """Usar un serializer distinto para GET vs PUT/PATCH."""
        if self.request.method in ["PUT", "PATCH"]:
            return ProfileUpdateSerializer
        return ProfileSerializer

    def get_object(self):
        return self.request.user


class AdminOnlyView(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        return Response({"message": "Solo los admins pueden ver esto."})


class SuperuserOnlyView(generics.GenericAPIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        return Response({"message": "Solo los superusuarios pueden ver esto."})


class PublicView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"message": "Este es un endpoint público."})

class LoginView(APIView):
    """
    Endpoint de autenticación de usuarios.
    Soporta tanto JWT como sesiones tradicionales de Django.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        """
        Autentica un usuario con email y contraseña.
        El tipo de autenticación se determina por la configuración AUTH_TYPE.
        """
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Determinar el tipo de autenticación según settings
            auth_type = getattr(settings, 'AUTH_TYPE', 'SESSION')

            if auth_type == 'JWT' and JWT_AVAILABLE:
                return self._handle_jwt_login(user)
            else:
                return self._handle_session_login(request, user)
            
        # Si el serializer no es válido, devuelve errores
        return Response(
            {
                'ERROR': 'Autenticación fallida',
                'detail': serializer.errors
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    def _handle_jwt_login(self, user):
        """
        Maneja login con JWT
        """
        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": "Autenticación exitosa",
            "auth_type": "JWT",
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }, status=status.HTTP_200_OK)

    def _handle_session_login(self, request, user):
        """
        Maneja login con sesión tradicional
        """
        login(request, user)

        return Response({
            'success': True,
            'message': 'Autenticación exitosa',
            'auth_type': 'SESSION',
            'session_id': request.session.session_key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)