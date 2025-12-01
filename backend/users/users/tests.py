# backend/django_backend/users/tests.py

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class AuthFlowTests(APITestCase):
    """
    Tests básicos para comprobar que:
    - El login JWT funciona.
    - /me requiere autenticación.
    - /me devuelve el usuario autenticado.
    - El registro crea un usuario en la base de datos (PostgreSQL).
    """

    def setUp(self):
        self.password = "TestPass123!"
        self.user = User.objects.create_user(
            username="testuser",
            password=self.password,
        )

    def test_login_returns_jwt_tokens(self):
        """
        Comprobar que /api/auth/login/ devuelve access y refresh.
        """
        url = reverse("token_obtain_pair")  # nombre que ya tienes en urls
        response = self.client.post(
            url,
            {"username": self.user.username, "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_me_requires_authentication(self):
        """
        Comprobar que /api/auth/me/ sin token devuelve 401.
        """
        url = reverse("me")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_user_when_authenticated(self):
        """
        Comprobar que /api/auth/me/ con un token válido devuelve el usuario correcto.
        """
        login_url = reverse("token_obtain_pair")
        login_response = self.client.post(
            login_url,
            {"username": self.user.username, "password": self.password},
            format="json",
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        access = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        url = reverse("me")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)

    def test_register_creates_user(self):
        """
        Comprobar que /api/auth/register/ crea un usuario en la base de datos.

        ⚠️ IMPORTANTE:
        Si tu endpoint de registro pide más campos (por ejemplo email o password2),
        añade esas claves al payload.
        """
        url = reverse("register")
        payload = {
            "username": "newuser",
            "password": "NewPass123!",
            "password2": "NewPass123!",  # tu serializer lo pide, así que lo mandamos
            # "email": "newuser@example.com",  # solo si algún día lo haces obligatorio
        }

        response = self.client.post(url, payload, format="json")

        # DEBUG opcional (puedes quitarlo cuando vaya bien)
        print("STATUS:", response.status_code)
        print("DATA:", response.data)

        # Algunos setups devuelven 201, otros 200; aceptamos ambos
        self.assertIn(response.status_code, (status.HTTP_201_CREATED, status.HTTP_200_OK))
        self.assertTrue(User.objects.filter(username="newuser").exists())
