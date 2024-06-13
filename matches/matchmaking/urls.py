# urls.py

from django.urls import path
from .views import (
    CreatePlayer,
    CreateChallenge,
    GetNextMatch,
    DeleteHistory,
    GetMyHistory,
    UpdateMatchResult,
    GetUserHistory
)

urlpatterns = [
    path('create-player/', CreatePlayer.as_view(), name='create-player'),
    path('create-challenge/', CreateChallenge.as_view(), name='create-challenge'),
    path('get-next-match/', GetNextMatch.as_view(), name='get-next-match'),
    path('delete-history/', DeleteHistory.as_view(), name='delete-history'),
    path('get-history/', GetMyHistory.as_view(), name='get-history'),
    path('update-match-result/', UpdateMatchResult.as_view(), name='update-match-result'),
    path('get-user-history/', GetUserHistory.as_view(), name='get-user-history'),
]
