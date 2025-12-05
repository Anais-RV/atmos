from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .serializers import (
    UserRegisterSerializer, ProfileSerializer, ProfileUpdateSerializer
)

class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class AdminOnlyView(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        return Response({"message": "Solo los admins pueden ver esto."})


class SuperuserOnlyView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response(
                {"detail": "No tienes permiso para acceder a este recurso."},
                status=403
            )
        return Response({"message": "Solo los superusuarios pueden ver esto."})


class PublicView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"message": "Este es un endpoint público."})
from rest_framework.response import Response