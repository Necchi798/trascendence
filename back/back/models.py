from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    nick = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=50, unique=True)
    password = models.CharField(max_length=50)

    USERNAME_FIELD = 'nick'
    REQUIRED_FIELDS = []
    

