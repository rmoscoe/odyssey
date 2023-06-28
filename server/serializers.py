from rest_framework import serializers
from .models import Adventure, Scene, Encounter, Custom_Field
from django.contrib.auth.models import User

class AdventureSerializer(serializers.ModelSerializer):

    class Meta:
        model=Adventure
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model=User
        fields=['id', 'username', 'email']

class SceneSerializer(serializers.ModelSerializer):

    class Meta:
        model=Scene
        fields='__all__'

class EncounterSerializer(serializers.ModelSerializer):

    class Meta:
        model=Encounter
        fields='__all__'

class CustomFieldSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Custom_Field
        fields='__all__'