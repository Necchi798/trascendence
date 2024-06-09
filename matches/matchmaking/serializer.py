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
        fields = ['id', 'nickname', 'user_id']


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'tournament', 'round_number','player1', 'player2', 'winner',  'created_at', 'ended_at', 'has_ended', 'direct_match']


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'creator', 'player_count', 'n_rounds', 'curr_round', 'created_at', 'ended_at']


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