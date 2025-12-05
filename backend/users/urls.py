from django.urls import path
from .views import RegisterView, MeView, AdminOnlyView, ProfileView, SuperuserOnlyView, PublicView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("admin-only/", AdminOnlyView.as_view(), name="admin-only"),
    path("superuser-only/", SuperuserOnlyView.as_view(), name="superuser-only"),
    path("public/", PublicView.as_view(), name="public"),
]