from django.contrib import admin
from django.urls import path
from .views import QRCodeCreationView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('test/', QRCodeCreationView.as_view()),
]
