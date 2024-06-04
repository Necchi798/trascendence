from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .models import User42
import requests
import jwt, datetime

class Api42(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            redir_uri = settings.REDIRECT_URI + 'login'
        else:
            redir_uri = settings.REDIRECT_URI + 'settings'

        payload = {
            'client_id': settings.CLIENT_ID,
            'redirect_uri': redir_uri,
            'response_type': 'code'
        }
        return Response(status=status.HTTP_200_OK, data={'url': 'https://api.intra.42.fr/oauth/authorize?' + '&'.join([f'{key}={value}' for key, value in payload.items()])})


class Enable42(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Missing jwt')
        try:
            jwt_decode = jwt.decode(token, settings.SECRET_JWT, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired jwt')
        except jwt.ImmatureSignatureError:
            raise AuthenticationFailed('Invalid jwt')

        user=User42.objects.filter(owner_id=jwt_decode['id']).first()
        if not user:
            return Response(status=status.HTTP_200_OK, data={'message': 'User not found'})
        return Response(status=status.HTTP_200_OK, data={'message': 'User found', 'id_42': user.id_42})

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

        payload = {
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'code': request.data.get('code'),
            'redirect_uri': settings.REDIRECT_URI + 'settings',
            'grant_type': 'authorization_code'
        }
        first_step=requests.request("POST", "https://api.intra.42.fr/oauth/token", data=payload)
        if first_step.status_code != 200:
            raise AuthenticationFailed('Invalid code')
        response = requests.request("GET", "https://api.intra.42.fr/v2/me", headers={'Authorization': 'Bearer ' + first_step.json()['access_token']})
        if response.status_code != 200:
            raise AuthenticationFailed('Invalid token')
        user=User42.objects.create(owner_id=jwt_decode['id'], id_42=response.json()['id'])
        user.save()
        login_name = response.json()['login']
        print(user)
        return Response(status=status.HTTP_200_OK, data={'message': 'User created', 'id_42': user.id_42, 'login': login_name})

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
                'redirect_uri': settings.REDIRECT_URI + 'login'
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
        else:
            print("user found")
        payload = {
        'id': user.owner_id,
        'exp': datetime.datetime.now() + datetime.timedelta(minutes=120),
        'iat': datetime.datetime.now(tz=datetime.timezone.utc)
        }
        print(payload)
        token = jwt.encode(payload, settings.SECRET_JWT, algorithm='HS256')
        response = Response()
        response.set_cookie('jwt', token, secure=True, samesite='None')
        response.data = {
            'jwt': token
        }

        return response
