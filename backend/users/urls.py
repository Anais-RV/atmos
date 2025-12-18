from django.urls import path
from .views import (
    RegisterView, MeView, ProfileView,
    AdminOnlyView, SuperuserOnlyView, PublicView,
    LoginView, ChangePasswordView, PasswordResetRequestView,
    UserPreferencesView
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("admin-only/", AdminOnlyView.as_view(), name="admin-only"),
    path("superuser-only/", SuperuserOnlyView.as_view(), name="superuser-only"),
    path("public/", PublicView.as_view(), name="public"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("password-reset/request/", PasswordResetRequestView.as_view(), name="password-reset"),
    path("preferences/", UserPreferencesView.as_view(), name="preferences"),
]

