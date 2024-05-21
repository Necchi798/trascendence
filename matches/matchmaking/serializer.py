from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Player, Match, Tournament

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PlayerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Player
        fields = ['id', 'user', 'nickname', 'tournament']

class MatchSerializer(serializers.ModelSerializer):
    player1 = PlayerSerializer(read_only=True)
    player2 = PlayerSerializer(read_only=True)
    winner = PlayerSerializer(read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'tournament', 'round_number', 'player1', 'player2', 'winner', 'is_completed', 'start_time', 'end_time']

class TournamentSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Tournament
        fields = ['id', 'creator', 'player_count', 'current_round', 'total_rounds', 'start_time', 'end_time', 'players']

class SubmitMatchResultSerializer(serializers.Serializer):
    winner_id = serializers.IntegerField()
