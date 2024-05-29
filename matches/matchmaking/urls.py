# urls.py

from django.urls import path
from .views import (
    CreateChallenge,
    GetNextMatch,
    DeleteHistory,
    GetHistory,
    UpdateMatchResult,
    UpdateTournament,
    GetNextRound
)

urlpatterns = [
    path('create-challenge/', CreateChallenge.as_view(), name='create-challenge'),
    path('get-next-match/<int:index>/', GetNextMatch.as_view(), name='get-next-match'),
    path('delete-history/', DeleteHistory.as_view(), name='delete-history'),
    path('get-history/', GetHistory.as_view(), name='get-history'),
    path('update-match-result/<int:match_id>/', UpdateMatchResult.as_view(), name='update-match-result'),
    path('update-tournament/<int:tournament_id>/', UpdateTournament.as_view(), name='update-tournament'),
    path('get-next-round/<int:tournament_id>/', GetNextRound.as_view(), name='get-next-round')
]
