from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .serializer import UserSerializer
from .models import User
import jwt, datetime

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class RegisterView(APIView):
    @swagger_auto_schema(
        request_body=UserSerializer,  # Specifica il serializer per il corpo della richiesta
        responses={200: 'Success', 400: 'Bad Request'},  # Specifica le risposte possibili
        operation_description="Register a new user"  # Descrivi brevemente l'operazione
    )

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class LoginView(APIView):

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING)
            },
            required=['username', 'password']
        ),
        responses={
            200: 'Success',
            400: 'Bad Request',
            401: 'Unauthorized'
        },
        operation_description="Login with username and password"
    )

    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = User.objects.filter(username=username).first()
        if user is None:
            raise AuthenticationFailed('User not found!')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        
        payload = {
            'id': user.id,
            'exp': datetime.datetime.now() + datetime.timedelta(minutes=120),
            'iat': datetime.datetime.now(tz=datetime.timezone.utc)
        }
        print(payload)
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        response = Response()
        response.set_cookie('jwt', token, secure=True, samesite='None')
        response.data = {
            'jwt': token
        }

        return response
    
class UserView(APIView):
    @swagger_auto_schema(
        responses={
            200: 'Success',
            400: 'Bad Request',
            401: 'Unauthorized'
        },
        operation_description="Get user details"
    )

    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Missing jwt')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired jwt')
        except jwt.ImmatureSignatureError:
            raise AuthenticationFailed('Invalid jwt')
        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    @swagger_auto_schema(
        
        responses={
            200: 'Success',
            400: 'Bad Request',
            401: 'Unauthorized'
        },
        operation_description="Logout the user"
    )
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'logout success!'
        }
        return response


class UpdateUserView(APIView):

    @swagger_auto_schema(
        request_body=UserSerializer,
        responses={
            200: 'Success',
            400: 'Bad Request',
            401: 'Unauthorized'
        },
        operation_description="Update user details"
    )

    def patch(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        
        user = User.objects.filter(id=payload['id']).first()

        serializer = UserSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User updated successfully', 'user': serializer.data})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
