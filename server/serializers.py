from rest_framework import serializers
from .models import Adventure, Scene, Encounter, Custom_Field, Odyssey_Token
from django.contrib.auth.models import User

# class OdysseyTokenSerializer(serializers.ModelSerializer):

#     class Meta:
#         model=Odyssey_Token
#         fields='__all__'

class CustomFieldSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Custom_Field
        fields='__all__'

class EncounterSerializer(serializers.ModelSerializer):
    # custom_field_set = CustomFieldSerializer(many=True)

    class Meta:
        model=Encounter
        fields='__all__'

class SceneSerializer(serializers.ModelSerializer):
    # custom_field_set = CustomFieldSerializer(many=True)
    # encounter_set = EncounterSerializer(many=True)
    class Meta:
        model=Scene
        fields='__all__'

class AdventureSerializer(serializers.ModelSerializer):
    scene_set = SceneSerializer(many=True, read_only=True)

    class Meta:
        model = Adventure
        fields = '__all__'


class AdventureCreateSerializer(serializers.ModelSerializer):
    # scene_set = SceneSerializer(many=True)
    # custom_field_set = CustomFieldSerializer(many=True)

    class Meta:
        model=Adventure
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model=User
        fields='__all__'
