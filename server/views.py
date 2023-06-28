from django.shortcuts import render
from rest_framework import viewsets
from server.models import Adventure, Scene, Encounter, Custom_Field
from django.contrib.auth.models import User
from server.serializers import AdventureSerializer, UserSerializer, SceneSerializer, EncounterSerializer, CustomFieldSerializer
from rest_framework.response import Response

# Create your views here.
def home(request):
    context = {}
    return render(request, "index.html", context)

class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer

class AdventureViewSet(viewsets.ModelViewSet):

    queryset = Adventure.objects.all()
    serializer_class = AdventureSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class SceneViewSet(viewsets.ModelViewSet):

    queryset = Scene.objects.all()
    serializer_class = SceneSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class EncounterViewSet(viewsets.ModelViewSet):

    queryset = Encounter.objects.all()
    serializer_class = EncounterSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class CustomFieldViewSet(viewsets.ModelViewSet):

    queryset = Custom_Field.objects.all()
    serializer_class = CustomFieldSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)