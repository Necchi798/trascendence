from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, UpdateUserView, AvatarView, Friend, UsersView
from rest_framework import permissions


urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/', UserView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('updateuser/', UpdateUserView.as_view()),
    path('avatar/', AvatarView.as_view()),
    path('friend/', Friend.as_view()),
	path('users/', UsersView.as_view())
]
