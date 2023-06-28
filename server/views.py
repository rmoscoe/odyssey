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

    def create(self, request):
        try:
            user = User.objects.create_user(
                request.data['username'], request.data['email'], request.data['password']
            )
            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({'error': 'Unable to create user'}, status=400)

    def partial_update(self, request):
        if 'password' in request.data:
            try:
                user = User.objects.get(username=request.user.username)
                user.set_password(request.data['password'])
                user.save()
            except User.DoesNotExist:
                return Response({'error': 'Unable to reset password'}, status=500)

        if 'email' in request.data:
            try:
                instance = self.get_object()
                new_email = {'email': request.data['email'], 'username': request.data['email']}
                serializer = self.get_serializer(instance, data=new_email, partial=True)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
            except Exception as e:
                return Response({'error': 'Unable to update email'}, status=500)

        user = User.objects.get(pk=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)

class AdventureViewSet(viewsets.ModelViewSet):

    queryset = Adventure.objects.all()
    serializer_class = AdventureSerializer

    def partial_update(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
    
        if user_id:
            queryset = queryset.filter(user_id=user_id)
    
        return queryset.prefetch_related('scene_set')


class SceneViewSet(viewsets.ModelViewSet):

    queryset = Scene.objects.all()
    serializer_class = SceneSerializer

    def partial_update(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class EncounterViewSet(viewsets.ModelViewSet):

    queryset = Encounter.objects.all()
    serializer_class = EncounterSerializer

    def partial_update(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class CustomFieldViewSet(viewsets.ModelViewSet):

    queryset = Custom_Field.objects.all()
    serializer_class = CustomFieldSerializer

    def partial_update(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)