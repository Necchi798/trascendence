# views.py
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Tournament, Player, Match
from .serializer import UserSerializer, PlayerSerializer, MatchSerializer, TournamentSerializer, SubmitMatchResultSerializer

@api_view(['POST'])
def create_tournament(request, x):
    creator = request.user  # Assuming the user is authenticated
    tournament = Tournament.objects.create(creator=creator, player_count=x)
    Player.objects.create(user=creator, nickname='Player 0', tournament=tournament)

    for i in range(1, x + 1):
        user = User.objects.create(username=f'player_{i}')
        Player.objects.create(user=user, nickname=f'Player {i}', tournament=tournament)

    return Response({'success': True, 'message': f'Tournament created with {x} players'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def start_tournament(request, tournament_id):
    tournament = get_object_or_404(Tournament, id=tournament_id)
    if not tournament.is_active:
        return Response({'success': False, 'message': 'Tournament has already ended'}, status=status.HTTP_400_BAD_REQUEST)

    if tournament.start_time is None:
        tournament.start_time = timezone.now()
        tournament.save()

    players = list(tournament.players.all())

    # Start the first round
    _create_matches(tournament, players)
    return Response({'success': True, 'message': 'Tournament started'}, status=status.HTTP_200_OK)

def _create_matches(tournament, players):
    random.shuffle(players)
    matches = []
    while len(players) > 1:
        player1 = players.pop()
        player2 = players.pop()
        match = Match.objects.create(tournament=tournament, round_number=tournament.current_round, player1=player1, player2=player2, start_time=timezone.now())
        matches.append(match)

    # If odd number of players, last one gets a bye
    if players:
        player1 = players.pop()
        match = Match.objects.create(tournament=tournament, round_number=tournament.current_round, player1=player1, start_time=timezone.now())
        match.winner = player1
        match.is_completed = True
        match.end_time = timezone.now()
        match.save()

    return matches

@api_view(['POST'])
def submit_match_result(request, match_id):
    match = get_object_or_404(Match, id=match_id)
    serializer = SubmitMatchResultSerializer(data=request.data)
    if serializer.is_valid():
        winner_id = serializer.validated_data['winner_id']
        winner = get_object_or_404(Player, id=winner_id)

        match.winner = winner
        match.is_completed = True
        match.end_time = timezone.now()
        match.save()

        # Check if all matches in the current round are completed
        if not Match.objects.filter(tournament=match.tournament, round_number=match.round_number, is_completed=False).exists():
            # Start next round or declare winner
            remaining_players = list(Player.objects.filter(tournament=match.tournament, won_matches__isnull=False).distinct())
            if len(remaining_players) == 1:
                match.tournament.is_active = False
                match.tournament.end_time = timezone.now()
                match.tournament.save()
                return Response({'success': True, 'message': f'Tournament ended, winner is {remaining_players[0].nickname}'}, status=status.HTTP_200_OK)
            else:
                match.tournament.current_round += 1
                match.tournament.save()
                _create_matches(match.tournament, remaining_players)

        return Response({'success': True, 'message': 'Match result submitted'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def match_history(request, player_id):
    player = get_object_or_404(Player, id=player_id)
    matches = Match.objects.filter(player1=player) | Match.objects.filter(player2=player)
    serializer = MatchSerializer(matches, many=True)
    return Response({'success': True, 'matches': serializer.data}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_player_history(request, player_id):
    player = get_object_or_404(Player, id=player_id)
    Match.objects.filter(player1=player).delete()
    Match.objects.filter(player2=player).delete()
    player.delete()
    return Response({'success': True, 'message': 'Player history deleted'}, status=status.HTTP_200_OK)

def get_next_round_players(current_players):
    next_round_players = []

    if len(current_players) % 2 != 0:
        # Assign a bye to one player
        bye_player = current_players[-1]
        match = Match.objects.create(player1=bye_player, player2=bye_player, winner=bye_player)
        next_round_players.append(bye_player)
        current_players = current_players[:-1]

    random.shuffle(current_players)
    for i in range(0, len(current_players), 2):
        match = Match.objects.create(player1=current_players[i], player2=current_players[i + 1])
        next_round_players.append(match.winner)
    return next_round_players
