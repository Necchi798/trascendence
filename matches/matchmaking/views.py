from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from .models import Tournament, Player, Match, User
from .serializer import TournamentSerializer, MatchSerializer, PlayerSerializer, UserSerializer, ChallengeSerializer
import random,  jwt
from django.db.models import Q

class CreatePlayer(APIView):
    def post(self, request):
        token = request.COOKIES.get('jwt')
        name = request.data['name']
        if not token:
            raise AuthenticationFailed('Missing jwt')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired jwt')    
        if not name:
            return Response({'error': 'Name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        player,created = Player.objects.get_or_create(nickname=name,user_id=payload['id'])
        return Response({'success': True, 'message': f'Player "{name}" created.'}, status=status.HTTP_200_OK)


class GetNextMatch(APIView):
    def post(self, request):
        index = request.data.get('tournament_id')
        try:
            
            matchs = Match.objects.filter(tournament=index)
            toRet = list(matchs.values("id","creator","has_ended","player1","player2","winner"))
            if len(toRet) == 3 and toRet[0]["has_ended"] and toRet[1]["has_ended"] and toRet[2]["has_ended"]:
                 return Response({'message': 'torneo finito'}, status=status.HTTP_200_OK)
            if  toRet[0]["has_ended"] and toRet[1]["has_ended"]:
                match = Match.objects.create(
                    player1=Player.objects.filter(id=toRet[0]["winner"]).first(),
                    player2=Player.objects.filter(id=toRet[1]["winner"]).first(),
                    created_at=timezone.now(),
                    round_number=2,
                    has_ended=False,
                    tournament=Tournament.objects.filter(id=index).first()
                )
                match.save()
                toRet = list(Match.objects.filter(id=match.id).values("id", "creator", "has_ended", "player1", "player2", "winner"))
            response_data = {
                'success': True,
                'message': 'Match details retrieved successfully.',
                'matches': toRet
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Match.DoesNotExist:
            return Response({'error': 'Match not found'}, status=status.HTTP_404_NOT_FOUND)

class CreateChallenge(APIView):
    def post(self, request):
        names=request.data.get('names')
        for x in range(len(names)):
            print(names[x])
        if not isinstance(names, list):
            return Response({'error': 'Expected a list of names.'}, status=status.HTTP_400_BAD_REQUEST)
        
        for x in names:
            if x == "":
                return Response({'error': 'Expected list of names whit empty names.'}, status=status.HTTP_400_BAD_REQUEST)
        

        if not names or len(names) < 2:
            return Response({'error': 'At least 2 players are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        players = []

        for name in names:
            player,created = Player.objects.get_or_create(nickname=name)
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

        creator = players[0].id
        rounds = 0
        x = len(players)
        if len(players) % 2 == 0:
            while x > 1:
                x = x / 2
                rounds += 1
        else:
            x += 1
            while x > 1:
                x = x / 2
                rounds += 1  
        tournament = Tournament.objects.create(
            creator=creator, 
            player_count=len(players), 
            curr_round=0,
            n_rounds = rounds,
            created_at =timezone.now(),
        )
        
        for player in players:
            #player.tournament = tournament
            player.save()

        matchs = self._create_matches(tournament, players)
        
        return Response({'success': True, 'message': 'Tournament created with multiple players', 'tournament_id': tournament.id, 'match_id': matchs[0].id}, status=status.HTTP_200_OK)
    
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
        
        print(matches)
        return matches


class DeleteHistory(APIView):
    def delete(self, request, user_id):
        matches = Match.objects.filter(player1__user__id=user_id) | Match.objects.filter(player2__user__id=user_id)
        match_count = matches.count()
        matches.delete()
        return Response({'success': True, 'message': f'{match_count} matches deleted.'}, status=status.HTTP_200_OK)
   