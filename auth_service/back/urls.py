from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, UpdateUserView 
from . import views #per create_tournament, add_friend, start_tournament, senza dava errori
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="My API description",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="Awesome License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('UpdateUser',UpdateUserView.as_view()),
    
    
    path('swagger', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('create-tournament/<int:x>/', views.create_tournament, name='create_tournament'),
    path('add-friend/<int:user_id>/<int:friend_id>/', views.add_friend, name='add_friend'),
    path('start-tournament/<int:tournament_id>/', views.start_tournament, name='start_tournament'),
]
