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
    ChangePasswordSerializer
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
            serializer.save()
            return Response(
                {"message": "Usuario creado correctamente"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """
    Devuelve los datos del usuario autenticado.
    Requiere JWT válido.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user: User = request.user
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }
        return Response(data, status=status.HTTP_200_OK)


class AdminOnlyView(APIView):
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