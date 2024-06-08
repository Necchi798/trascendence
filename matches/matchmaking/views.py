from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Tournament, Player, Match, User
from .serializer import TournamentSerializer, MatchSerializer, PlayerSerializer, UserSerializer, ChallengeSerializer
import random,  json

class GetNextMatch(APIView):
    def get(self, request, index):
        try:
            match = Match.objects.all()[index]
            serializer = MatchSerializer(match)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except IndexError:
            return Response({'error': 'No match found at this index.'}, status=status.HTTP_404_NOT_FOUND)


class CreateChallenge(APIView):
    def post(self, request):
        
        names=request.data.get('names')
        print(names)

        if not isinstance(names, list):
            return Response({'error': 'Expected a list of names.'}, status=status.HTTP_400_BAD_REQUEST)

        if not names or len(names) < 2:
            return Response({'error': 'At least 2 players are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        players = []

        for name in names:
            user, created = User.objects.get_or_create(username=name)
            player, created = Player.objects.get_or_create(user=user, nickname=name)
            players.append(player)

        if len(players) == 2:
            match = Match.objects.create(
                player1=players[0],
                player2=players[1],
                created_at=timezone.now(),
                round_number=-1,
                has_ended=False,
                tournament=None
            )
            return Response({'success': True, 'message': 'Single match created.', 'match_id': match.id}, status=status.HTTP_200_OK)

        creator = players[0].user
        tournament = Tournament.objects.create(
            creator=creator, 
            player_count=len(players), 
            curr_round=0, 
            created_at =timezone.now(),
        )
        
        for player in players:
            player.tournament = tournament
            player.save()

        self._create_matches(tournament, players)
        
        return Response({'success': True, 'message': 'Tournament created with multiple players', 'tournament_id': tournament.id}, status=status.HTTP_200_OK)
    
    def _create_matches(self, tournament, players):
        random.shuffle(players)
        matches = []
        while len(players) > 1:
            player1 = players.pop()
            player2 = players.pop()
            match = Match.objects.create(
                tournament=tournament,
                round_number=tournament.curr_round,
                player1=player1,
                player2=player2,
                created_at=timezone.now(),
                has_ended=False
            )
            matches.append(match)
        
        if players:
            player = players.pop()
            match = Match.objects.create(
                tournament=tournament,
                round_number=tournament.curr_round,
                player1=player,
                player2=None,
                winner=player,
                ended_at=timezone.now(),
                has_ended=True
            )
            matches.append(match)
        
        return matches


class DeleteHistory(APIView):
    def delete(self, request):
        username = request.data.get('username')
        if not username:
            return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, username=username)
        
        # Update matches
        Match.objects.filter(player1__user=user).update(player1=None)
        Match.objects.filter(player2__user=user).update(player2=None)
        Match.objects.filter(winner__user=user).update(winner=None)
        
        # Update tournaments
        Tournament.objects.filter(creator=user).update(creator=None)

        user.delete()

        return Response({'success': True, 'message': 'User history deleted and references updated.'}, status=status.HTTP_200_OK)


class GetHistory(APIView):
    def get(self, request):
        username = request.user.username
        if not username:
            return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, username=username)
        player = get_object_or_404(Player, user=user)
        
        tournaments = Tournament.objects.filter(players=player)
        matches = Match.objects.filter(player1=player) | Match.objects.filter(player2=player)

        tournament_serializer = TournamentSerializer(tournaments, many=True)
        match_serializer = MatchSerializer(matches, many=True)

        return Response({
            'tournaments': tournament_serializer.data,
            'matches': match_serializer.data
        }, status=status.HTTP_200_OK)


class UpdateMatchResult(APIView):
    def post(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        winner_name = request.data.get('winner')
        if not winner_name:
            return Response({'error': 'Winner name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        winner = get_object_or_404(Player, nickname=winner_name)
        match.winner = winner
        match.has_ended = True
        match.ended_at = timezone.now()
        match.save()

        return Response({'success': True, 'message': 'Match result updated.'}, status=status.HTTP_200_OK)


class UpdateTournament(APIView):
    def post(self, request, tournament_id):
        tournament = get_object_or_404(Tournament, id=tournament_id)
        serializer = TournamentSerializer(tournament, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Tournament updated.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetNextRound(APIView):
    def post(self, request, tournament_id):
        tournament = get_object_or_404(Tournament, id=tournament_id)
        if tournament.curr_round >= tournament.total_rounds:
            return Response({'message': 'Tournament has ended.'}, status=status.HTTP_200_OK)

        names = request.data.get('names')
        players = [Player.objects.get_or_create(user=User.objects.get_or_create(username=name)[0], nickname=name)[0] for name in names]

        random.shuffle(players)
        self._create_matches(tournament, players)

        tournament.curr_round += 1
        tournament.save()

        return Response({'success': True, 'message': f'Round {tournament.curr_round} matches created.'}, status=status.HTTP_200_OK)
    
    def _create_matches(self, tournament, players):
        matches = []
        while len(players) > 1:
            player1 = players.pop()
            player2 = players.pop()
            match = Match.objects.create(
                tournament=tournament,
                round_number=tournament.curr_round,
                player1=player1,
                player2=player2,
                created_at=timezone.now(),
                has_ended=False
            )
            matches.append(match)

        if players:
            player = players.pop()
            match = Match.objects.create(
                tournament=tournament,
                round_number=tournament.curr_round,
                player1=player,
                player2=None,
                winner=player,
                ended_at=timezone.now(),
                has_ended=True
            )
            matches.append(match)

        return matches
