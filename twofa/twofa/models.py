from django.db import models

class QRCode(models.Model):
    image = models.BinaryField()
    owner_id = models.IntegerField(unique=True)
    email=models.EmailField(max_length=255, unique=True, null=True)
