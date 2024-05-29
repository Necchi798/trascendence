from django.urls import path
from .views import CreateChallenge, GetNextMatch, SubmitMatchResult, DeletePlayerHistory, GetHistory, UpdateTournament

urlpatterns = [
    path('create-challenge/', CreateChallenge.as_view(), name='create_challenge'),
    path('get-next-match/<int:index>/', GetNextMatch.as_view(), name='get_next_match'),
    path('submit-match-result/<int:match_id>/', SubmitMatchResult.as_view(), name='submit_match_result'),
    path('delete-player-history/<str:username>/', DeletePlayerHistory.as_view(), name='delete_player_history'),
    path('get-history/', GetHistory.as_view(), name='get_history'),
    path('update-tournament/<int:tournament_id>/', UpdateTournament.as_view(), name='update_tournament'),
]
