from .models import User
from rest_framework import serializers
import base64

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email', 'password', 'two_factor', 'api42', 'avatar', 'last_fetch']
        extra_kwargs = {
            'password': {'write_only': True}
            }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        
        image_data = None
        with open("back/default-avatar.png", 'rb') as f:
            image_data = f.read()

        instance.avatar = image_data

        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        instance.two_factor = validated_data.get('two_factor', instance.two_factor)
        instance.api42 = validated_data.get('api42', instance.api42)
        instance.save()
        return instance
