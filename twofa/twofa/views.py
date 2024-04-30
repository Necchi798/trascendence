from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .models import TFAUser


class registerTFAUser(APIView):
    def post(self, request):
        user = TFAUser.objects.create(
            user_id=request.data['user_id'],
        )
        user.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)