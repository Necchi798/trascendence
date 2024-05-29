from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Tournament, Player, Match, User
from .serializer import UserSerializer, PlayerSerializer, MatchSerializer, TournamentSerializer, SubmitMatchResultSerializer

class CreateChallenge(APIView):
    def post(self, request):
        names = request.data.get('names')
        if not names or len(names) < 2:
            return Response({'error': 'At least 2 players are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        players = [name for name in names]

        
        if len(players) == 2:
            player1 = players[0]
            player2 = players[1]
            match = Match.objects.create(
                player1=Player.objects.get_or_create(user=player1)[0],
                player2=Player.objects.get_or_create(user=player2)[0],
                created_at=timezone.now(),
                direct_match=True
            )
            return Response({'success': True, 'message': 'Single match created.', 'match_id': match.id}, status=status.HTTP_200_OK)
        
        creator = request.user
        tournament = Tournament.objects.create(creator=creator, player_count=len(players))
        
        for user in players:
            Player.objects.create(user=user, nickname=user.username, tournament=tournament)
        
        self._create_matches(tournament, players)
        
        return Response({'success': True, 'message': 'Tournament created with multiple players'}, status=status.HTTP_200_OK)
    
    def _create_matches(self, tournament, players):
        import random
        random.shuffle(players)
        while len(players) > 1:
            player1 = players.pop()
            player2 = players.pop()
            Match.objects.create(
                tournament=tournament,
                round_number=tournament.current_round,
                player1=Player.objects.get(user=player1),
                player2=Player.objects.get(user=player2),
                created_at=timezone.now(),
                direct_match=False
            )

class GetNextMatch(APIView):
    def get(self, request, index):
        match = get_object_or_404(Match, id=index)
        serializer = MatchSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeletePlayerHistory(APIView):
    def delete(self, request, username):
        if not username:
            return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, username=username)
        
        Match.objects.filter(player1__user=user).update(player1=None)
        Match.objects.filter(player2__user=user).update(player2=None)
        Match.objects.filter(winner__user=user).update(winner=None)
        
        Tournament.objects.filter(creator=user).update(creator=None)
        
        return Response({'success': True, 'message': 'Player history references removed.'}, status=status.HTTP_200_OK)

class GetHistory(APIView):
    def get(self, request):
        user = request.user
        if not user:
            return Response({'error': 'User is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        tournaments = Tournament.objects.filter(tournament_players__user=user)
        matches = Match.objects.filter(player1__user=user) | Match.objects.filter(player2__user=user)
        
        tournament_serializer = TournamentSerializer(tournaments, many=True)
        match_serializer = MatchSerializer(matches, many=True)
        
        return Response({
            'tournaments': tournament_serializer.data,
            'matches': match_serializer.data
        }, status=status.HTTP_200_OK)

class SubmitMatchResult(APIView):
    def post(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        serializer = SubmitMatchResultSerializer(data=request.data)
        if serializer.is_valid():
            winner_id = serializer.validated_data['winner_id']
            winner = get_object_or_404(Player, id=winner_id)

            match.winner = winner
            match.has_ended = True
            match.ended_at = timezone.now()
            match.save()

            return Response({'success': True, 'message': 'Match result submitted.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateTournament(APIView):
    def post(self, request, tournament_id):
        tournament = get_object_or_404(Tournament, id=tournament_id)
        serializer = TournamentSerializer(tournament, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Tournament updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
