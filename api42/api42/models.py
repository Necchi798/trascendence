from django.db import models

class User42(models.Model):
    owner_id = models.IntegerField(unique=True)
    id_42 = models.IntegerField(unique=True)
