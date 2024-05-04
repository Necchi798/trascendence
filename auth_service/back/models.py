from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    two_factor = models.BooleanField(default=False)
    api42 = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def add_friend(self, friend):
        if friend != self.friends.add(friend):
            friend.friends.add(self)
    
class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='player')

    def __str__(self):
        return self.user.username

class Match(models.Model):
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player1_matches')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player2_matches')
    winner = models.ForeignKey(Player, on_delete=models.CASCADE, blank=True, null=True)
    completed = models.BooleanField(default=False)

class Tournament(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tournament')
    start_time = models.DateTimeField(null=True, blank=True)
    friends_invited = models.ManyToManyField(User, related_name='invited_tournament', blank=True)
    player_count = models.IntegerField(default=0)

