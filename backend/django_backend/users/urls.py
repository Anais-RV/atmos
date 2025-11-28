from django.urls import path
from .views import RegisterView, MeView, AdminOnlyView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("admin-only/", AdminOnlyView.as_view(), name="admin-only"),
]
