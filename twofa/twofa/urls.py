from django.contrib import admin
from django.urls import path
from .views import QRCodeCreationView, TOPVerificationView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('qr', QRCodeCreationView.as_view()),
    path('verify', TOPVerificationView.as_view()),
]
