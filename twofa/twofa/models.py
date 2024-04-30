from django.db import models

class QRCode(models.Model):
    image = models.BinaryField()
    owner_id = models.IntegerField(unique=True)
