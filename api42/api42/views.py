from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .models import User42
import requests
import jwt, datetime


class Enable42(APIView):
    def post(self, request):
        payload = {
            'grant_type': 'authorization_code',
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'code': request.data.get('code'),
            'redirect_uri': settings.REDIRECT_URI

        }

        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Missing jwt')
        try:
            jwt_decode = jwt.decode(token, settings.SECRET_JWT, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired jwt')
        except jwt.ImmatureSignatureError:
            raise AuthenticationFailed('Invalid jwt')

        first_step=requests.request("POST", "https://api.intra.42.fr/oauth/token", data=payload)
        if first_step.status_code != 200:
            raise AuthenticationFailed('Invalid code')
        response = requests.request("GET", "https://api.intra.42.fr/v2/me", headers={'Authorization': 'Bearer ' + first_step.json()['access_token']})
        if response.status_code != 200:
            raise AuthenticationFailed('Invalid token')
        user=User42.objects.create(owner_id=jwt_decode['id'], id_42=response.json()['id'])
        user.save()
        print(user)
        return Response(status=status.HTTP_200_OK, data={'message': 'User created'})

class Disable42(APIView):
    def post(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Missing jwt')
        try:
            jwt_decode = jwt.decode(token, settings.SECRET_JWT, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired jwt')
        except jwt.ImmatureSignatureError:
            raise AuthenticationFailed('Invalid jwt')
        user = User42.objects.get(owner_id=jwt_decode['id'])
        user.delete()
        return Response(status=status.HTTP_200_OK, data={'message': 'User deleted'})

class login42(APIView):
    def post(self, request):
        payload = {
                'grant_type': 'authorization_code',
                'client_id': settings.CLIENT_ID,
                'client_secret': settings.CLIENT_SECRET,
                'code': request.data.get('code'),
                'redirect_uri': settings.REDIRECT_URI

            }
        first_step=requests.request("POST", "https://api.intra.42.fr/oauth/token", data=payload)
        if first_step.status_code != 200:
            raise AuthenticationFailed('Invalid code')
        response = requests.request("GET", "https://api.intra.42.fr/v2/me", headers={'Authorization': 'Bearer ' + first_step.json()['access_token']})
        if response.status_code != 200:
            raise AuthenticationFailed('Invalid token')
        user=User42.objects.filter(id_42=response.json()['id']).first()
        if not user:
            raise AuthenticationFailed('User not found')
        
        payload = {
        'id': user.id,
        'exp': datetime.datetime.now() + datetime.timedelta(minutes=120),
        'iat': datetime.datetime.now(tz=datetime.timezone.utc)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        response = Response()
        response.set_cookie('jwt', token, secure=True, samesite='None')
        response.data = {
            'jwt': token
        }

        return response
