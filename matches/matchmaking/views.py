from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Tournament, Player, Match, User
from .serializer import UserSerializer, PlayerSerializer, MatchSerializer, TournamentSerializer, SubmitMatchResultSerializer

class CreateTournament(APIView):
    def post(self, request):
        creator_username = request.data['username']
        player_count = request.data['players_number']
        
        creator = get_object_or_404(User, username=creator_username)
        tournament = Tournament.objects.create(creator=creator, player_count=player_count)
        Player.objects.create(user=creator, nickname='Player 0', tournament=tournament)

        for i in range(1, player_count + 1):
            user = User.objects.create(username=f'player_{i}')
            Player.objects.create(user=user, nickname=f'Player {i}', tournament=tournament)

        return Response({'success': True, 'message': f'Tournament created with {player_count} players'}, status=status.HTTP_200_OK)

class StartTournament(APIView):
    def post(self, request, tournament_id):
        tournament = get_object_or_404(Tournament, id=tournament_id)

        if tournament.start_time is None:
            tournament.start_time = timezone.now()
            tournament.save()

        players = list(tournament.tournament_players.all())
        self._create_matches(tournament, players)
        return Response({'success': True, 'message': 'Tournament started'}, status=status.HTTP_200_OK)

    def _create_matches(self, tournament, players):
        import random
        random.shuffle(players)
        matches = []
        while len(players) > 1:
            player1 = players.pop()
            player2 = players.pop()
            match = Match.objects.create(
                tournament=tournament, round_number=tournament.current_round,
                player1=player1, player2=player2, created_at=timezone.now()
            )
            matches.append(match)

        if players:
            player1 = players.pop()
            match = Match.objects.create(
                tournament=tournament, round_number=tournament.current_round,
                player1=player1, created_at=timezone.now()
            )
            match.winner = player1
            match.has_ended = True
            match.ended_at = timezone.now()
            match.save()

        return matches

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

            if not Match.objects.filter(tournament=match.tournament, round_number=match.round_number, has_ended=False).exists():
                remaining_players = list(Player.objects.filter(tournament=match.tournament, won_matches__isnull=False).distinct())
                if len(remaining_players) == 1:
                    return Response({'success': True, 'message': f'Tournament ended, winner is {remaining_players[0].nickname}'}, status=status.HTTP_200_OK)
                else:
                    match.tournament.current_round += 1
                    match.tournament.save()
                    self._create_matches(match.tournament, remaining_players)

            return Response({'success': True, 'message': 'Match result submitted'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MatchHistory(APIView):
    def delete(self, request, player_id):
        player = get_object_or_404(Player, id=player_id)
        user = request.user

        # Overwrite the creator occurrences
        Tournament.objects.filter(creator=user).update(creator=None)

        Match.objects.filter(player1=player).delete()
        Match.objects.filter(player2=player).delete()
        player.delete()
        return Response({'success': True, 'message': 'Player history deleted and creator references updated'}, status=status.HTTP_200_OK)
    
    def get(self, request):
        player_name = request.data.get('name')
        player = get_object_or_404(Player, nickname=player_name)
        matches = Match.objects.filter(player1=player) | Match.objects.filter(player2=player)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class NextMatch(APIView):
    def get(self, request):
        next_match = Match.objects.filter(has_ended=False).order_by('created_at').first()
        if next_match:
            serializer = MatchSerializer(next_match)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'message': 'No upcoming matches found.'}, status=status.HTTP_404_NOT_FOUND)
