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
    ChangePasswordSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
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
    
class ChangePasswordView(APIView):
    """
    Endpoint para cambiar la contraseña del usuario autenticado
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Contraseña actualizada exitosamente"
            }, status=status.HTTP_200_OK)
            
        return Response({
            "success": False,
            "message": "No se pudo actualizar la contraseña",
            "detail": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

# Importar modulo logging
import logging

logger = logging.getLogger(__name__)

class PasswordResetRequestView(APIView):
    """
    Endpoint para solicitar recuperación de contraseña.

    POST /api/auth/password-reset/request/
    Body: {"email": "usuario@ejemplo.com"}
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)

        if serializer.is_valid():
            try:
                serializer.save()

                # Siempre devolver el mismo mensaje (seguridad)
                return Response({
                    'success': True,
                    'message': 'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.'
                }, status=status.HTTP_200_OK)

            except Exception as e:
                logger.error(f"Error enviando email de recuperación: {str(e)}")

                return Response({
                    "success": False, 
                    "error": "Error al enviar el email",
                    "detail": "Hubo un problema al procesar tu solicitud. Inténtelo de nuevo."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response({
            'success': False,
            'error': 'Datos inválidos',
            'detail': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetVerifyView(APIView):
    """
    Endpoint para verificar un token de recuperación.
    
    GET /api/auth/password-reset/verify/{token}/
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        serializer = PasswordResetVerifyView(
            data={"token": token}
        )

        if serializer.is_valid():
            reset_token = serializer.context["reset_token"]

            return Response({
                "success": True,
                "message": "Token válido",
                "email": reset_token.user.email,
                "expires_at": reset_token.expires_at
            }, status=status.HTTP_200_OK)
        
        return Response({
            "success": False,
            "error": "Token inválido",
            "detail": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    """
    Endpoint para confirmar el restablecimiento de contraseña.
    
    POST /api/password-reset/confirm/
    Body: {
        "token": "uuid",
        "new_password": "NuevaContraseña123!",
        "new_password_confirm": "NuevaContraseña123!"
    }
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                return Response({
                    'success': True,
                    'message': 'Contraseña restablecida exitosamente',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username
                    }
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                logger.error(f"Error restableciendo contraseña: {str(e)}")
                
                return Response({
                    'success': False,
                    'error': 'Error al restablecer la contraseña',
                    'detail': 'Hubo un problema. Inténtalo de nuevo.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'success': False,
            'error': 'Datos inválidos',
            'detail': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)