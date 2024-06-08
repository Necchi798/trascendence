#serializer.py
from rest_framework import serializers
from .models import Tournament, Player, Match, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'user', 'nickname', 'tournament']


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'player1', 'player2', 'winner', 'tournament', 'round_number', 'start_time', 'end_time', 'is_completed']


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'creator', 'player_count', 'current_round', 'start_time', 'end_time', 'is_active', 'players']


class SubmitMatchResultSerializer(serializers.Serializer):
    winner_id = serializers.IntegerField()

    def validate_winner_id(self, value):
        # Validate that the winner ID corresponds to an existing player
        if not Player.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid winner ID.")
        return value
    
'''class ChallengeSerializer(serializers.Serializer):
    names = serializers.ListField(
        child=serializers.CharField(max_length=100),
    )
'''
class ChallengeSerializer(serializers.Serializer):
    names = serializers.ListField(
        child=serializers.CharField(max_length=100),
        min_length=2
    )