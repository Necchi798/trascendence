from django.db import models

# Create your models here.
class TFAUser(models.Model):
    user_id = models.CharField(max_length=255, unique=True)
    secret_key = models.CharField(max_length=255)
    otp_type = models.CharField(max_length=255, default='totp')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.user_id