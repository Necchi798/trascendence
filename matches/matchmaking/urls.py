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
    path('get-next-match/', GetNextMatch.as_view(), name='get-next-match'),
    path('delete-history/', DeleteHistory.as_view(), name='delete-history'),
    path('get-history/', GetHistory.as_view(), name='get-history'),
    path('update-match-result/', UpdateMatchResult.as_view(), name='update-match-result'),
    path('update-tournament/', UpdateTournament.as_view(), name='update-tournament'),
    path('get-next-round/', GetNextRound.as_view(), name='get-next-round')
]
