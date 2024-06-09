from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from django.http import HttpResponse
from .serializer import UserSerializer
from .models import User
import jwt, datetime, pyotp, base64, pyotp, base64

class RegisterView(APIView):
    def post(self, request):
        if not request.data['password']:
            raise AuthenticationFailed('Password required!')
        if not request.data['username']:
            raise AuthenticationFailed('Username required!')
        if not request.data['email']:
            raise AuthenticationFailed('Email required!')
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = User.objects.filter(username=username).first()
        if user is None:
            raise AuthenticationFailed('User not found!')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        if user.two_factor:

            if not request.data['otp']:
                response = Response()
                response.data = {
                    'detail': 'OTP required!',
                    "id": user.id,
                }
                response.status_code = 401
                return response
            else:
                print(request.data['otp'])
            key=base64.b32encode(settings.SECRET_KEY.encode() + str(user.id).encode())
            totp = pyotp.TOTP(key)
            if not totp.verify(request.data["otp"]):
                raise AuthenticationFailed(totp.now())
        print("code was good, making the jwt")
        payload = {
            'id': user.id,
            'exp': datetime.datetime.now() + datetime.timedelta(minutes=120),
            'iat': datetime.datetime.now(tz=datetime.timezone.utc)
        }
        user.last_fetch=datetime.datetime.now()
        user.save()
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        response = Response()
        response.set_cookie('jwt', token, secure=True, samesite='None')
        response.data = {
            'jwt': token
        }
        print(response.data["jwt"])
        return response
    
class UserView(APIView):
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
        user.last_fetch=datetime.datetime.now()
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'logout success!'
        }
        return response


class UpdateUserView(APIView):
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
        
class AvatarView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        
        user = User.objects.filter(id=payload['id']).first()
        avatar = user.avatar
        return HttpResponse(avatar, content_type="image/png")
    
    def patch(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        
        user = User.objects.filter(id=payload['id']).first()

        image = request.FILES.get('avatar')
        if not image:
            raise AuthenticationFailed('No image provided!')

        user.avatar = image.read()
        user.save()
        return Response({'message': 'Avatar updated successfully!'})
        
class Friend(APIView):
    def post(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        

        user = User.objects.filter(id=payload['id']).first()
        friend = User.objects.filter(username=request.data['friend']).first()
        if not friend:
            raise AuthenticationFailed('Friend not found!')
        user.friends.add(friend)
        return Response({'message': 'Friend added successfully!'})
    
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        
        user = User.objects.filter(id=payload['id']).first()
        friends = user.friends.all()
        return Response(UserSerializer(friends, many=True).data)
    
    def delete(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        
        user = User.objects.filter(id=payload['id']).first()
        friend = User.objects.filter(username=request.data['friend']).first()
        if not friend:
            raise AuthenticationFailed('Friend not found!')
        user.friends.remove(friend)
        return Response({'message': 'Friend removed successfully!'})
    

class UsersView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        
        # get the users that start with the query
        try:
            query = request.query_params.get('usr')
            print(query)
        except:
            raise AuthenticationFailed('Invalid query!')
        try:
            users = User.objects.all().filter(username__startswith=query).exclude(id=payload['id'])
        except:
            raise AuthenticationFailed('No users found!')
        friends = User.objects.filter(id=payload['id']).first().friends.all()
        # add a field to the users that are already friends
        res = UserSerializer(users, many=True).data
        for user in res:
            if User.objects.filter(id=user['id']).first() in friends:
                user['is_friend'] = True
            else:
                user['is_friend'] = False
        return Response(res)