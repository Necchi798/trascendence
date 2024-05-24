from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from django.shortcuts import redirect
from .serializer import UserSerializer
from .models import User
import jwt, datetime, pyotp, base64
import requests
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

        if user.two_factor:
            key=base64.b32encode(settings.SECRET_KEY.encode() + str(user.id).encode())
            totp = pyotp.TOTP(key)
#        print(str(totp.now()))
            try:
                if totp.verify(request.data["code"]) != True:
                    return Response(status=status.HTTP_401_UNAUTHORIZED, data={"message": "Code is invalid."})
            except:
                return Response(status=status.HTTP_401_UNAUTHORIZED, data={"message": "need code."})
        
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        response = Response()
        response.set_cookie(key='jwt', value=token, secure=True)
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
            raise AuthenticationFailed('Unauthenticated!')
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
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
