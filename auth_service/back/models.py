from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    two_factor = models.BooleanField(default=False)
    api42 = models.BooleanField(default=False)

    avatar = models.BinaryField()

    last_fetch = models.DateTimeField(auto_now=True)

    friends = models.ManyToManyField('self', blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
