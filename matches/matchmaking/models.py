from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='matchmaking_users',  # Changed related_name for auth.Group
        related_query_name='matchmaking_user',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='matchmaking_users_permissions',  # Changed related_name for auth.Permission
        related_query_name='matchmaking_user_permission',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    nickname = models.CharField(max_length=255, null=True, blank=True)
    tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, related_name='tournament_players')

class Tournament(models.Model):
    id = models.AutoField(primary_key=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tournament')
    player_count = models.IntegerField()
    current_round = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)

class Match(models.Model):
    id = models.AutoField(primary_key=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    round_number = models.IntegerField()
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player1_matches')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player2_matches')
    winner = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='won_matches', null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField
    has_ended = models.BooleanField(default=False)

