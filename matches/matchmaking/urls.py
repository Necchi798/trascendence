"""matches URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# urls.py

from django.contrib import admin
from django.urls import path
from matchmaking import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('create-tournament/<int:x>/', views.create_tournament, name='create_tournament'),
    path('start-tournament/<int:tournament_id>/', views.start_tournament, name='start_tournament'),
    path('submit-match-result/<int:match_id>/', views.submit_match_result, name='submit_match_result'),
    path('match-history/<int:player_id>/', views.match_history, name='match_history'),
    path('delete-player-history/<int:player_id>/', views.delete_player_history, name='delete_player_history'),
]
