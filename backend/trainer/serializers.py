from rest_framework import serializers

from .models import *

class GymSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'gym_id',
            'name',
            'address'
        ]
        model = Gym

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'trainer_id',
            'username',
            'password',
            'name',
            'is_approved',
            'gym_id',
        )
        model = Trainer

class ProfileImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        fields = ['title', 'image']
        model = Profile_Image

class LoginInfoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'trainer_id',
            'username',
        ]
        model = Trainer
