from django.urls import path
from .views import CreateTournament, StartTournament, SubmitMatchResult, MatchHistory, NextMatch

urlpatterns = [
    path('create-tournament/', CreateTournament.as_view(), name='create_tournament'),
    path('start-tournament/<int:tournament_id>/', StartTournament.as_view(), name='start_tournament'),
    path('submit-match-result/<int:match_id>/', SubmitMatchResult.as_view(), name='submit_match_result'),
    path('delete-player-history/<int:player_id>/', MatchHistory.as_view(), name='delete_player_history'),
    path('next-match/', NextMatch.as_view(), name='next_match'),  # New URL pattern
]
