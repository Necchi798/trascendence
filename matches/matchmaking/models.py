# models.py

from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='matchmaking_users',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='matchmaking_user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='matchmaking_users_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='matchmaking_user_permission',
    )

class Player(models.Model):
    id = models.AutoField(primary_key=True)
    nickname = models.CharField(max_length=255)
    user_id  = models.IntegerField(default=-1)


class Tournament(models.Model):
    id = models.AutoField(primary_key=True)
    creator = models.IntegerField(default=-1)
    player_count = models.IntegerField()
    n_rounds = models.IntegerField(default=1)
    curr_round = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

class Match(models.Model):
    id = models.AutoField(primary_key=True)
    creator = models.IntegerField(default=-1)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches', null=True, blank=True)
    round_number = models.IntegerField()
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player1_matches', null=True, blank=True)
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player2_matches', null=True, blank=True)
    winner = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='won_matches', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    has_ended = models.BooleanField(default=False)
    direct_match = models.BooleanField(default=False)
