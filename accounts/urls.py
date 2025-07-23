from django.contrib.auth.views import LogoutView
from django.urls import path

from .views import CustomLoginView, CustomSignUpView, CurrentUserView

urlpatterns = [
    path("signup/", CustomSignUpView.as_view(), name="signup"),
    path("login/", CustomLoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", CurrentUserView.as_view(), name="me"),
]
