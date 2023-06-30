from django.shortcuts import render
from rest_framework import viewsets
from server.models import Adventure, Scene, Encounter, Custom_Field
from django.contrib.auth.models import User
from server.serializers import AdventureSerializer, UserSerializer, SceneSerializer, EncounterSerializer, CustomFieldSerializer
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from .utils import update_secret_key
from rest_framework.views import APIView
from .palm import generate_adventure
from rest_framework.authtoken.models import Token
from django.utils import timezone
from datetime import timedelta
from server.models import Token

# import aiohttp

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
            token = Token.objects.create(user=user, expires_at=timezone.now() + timedelta(days=1))
            serializer = UserSerializer(user)
            return Response({'user': serializer.data, 'token': token}, status=200)
        except Exception as e:
            return Response({'error': 'Unable to create user'}, status=400)

    @login_required
    def partial_update(self, request):
        if 'password' in request.data:
            try:
                user = User.objects.get(username=request.user.username)
                user.set_password(request.data['password'])
                user.save()
            except User.DoesNotExist:
                return Response({'error': 'Unable to reset password'}, status=500)
            else:
                update_secret_key()

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
    
    def login(self, request):
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user is not None:
            login(request, user)
            token = Token.objects.create(user=user, expires_at=timezone.now() + timedelta(days=1))
            return Response(token, status=200)
        else:
            return Response({'error': 'Invalid email or password'}, status=401)
    
    def logout(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=200)

class AdventureViewSet(LoginRequiredMixin, viewsets.ModelViewSet):

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


class SceneViewSet(LoginRequiredMixin, viewsets.ModelViewSet):

    queryset = Scene.objects.all()
    serializer_class = SceneSerializer

    def partial_update(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class EncounterViewSet(LoginRequiredMixin, viewsets.ModelViewSet):

    queryset = Encounter.objects.all()
    serializer_class = EncounterSerializer

    def partial_update(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class CustomFieldViewSet(LoginRequiredMixin, viewsets.ModelViewSet):

    queryset = Custom_Field.objects.all()
    serializer_class = CustomFieldSerializer

    def partial_update(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class GenerateAdventureView(APIView):
    # Supposedly generate_adventure runs synchronously. If this causes problems, try using async await.
    def get(self, request):
        data = request.data
        campaign_setting = data.get('campaign_setting')
        level = data.get('level')
        experience = data.get('experience')
        context = data.get('context')
        
        adventure = generate_adventure(data.game, data.players, data.scenes, data.encounters, data.plot_twists, data.clues, campaign_setting, level, experience, context)

        return Response(adventure)