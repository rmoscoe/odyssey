from django.shortcuts import render
from rest_framework import viewsets
from server.models import Adventure, Scene, Encounter, Custom_Field, Odyssey_Token
from django.contrib.auth.models import User
from server.serializers import AdventureSerializer, UserSerializer, SceneSerializer, EncounterSerializer, CustomFieldSerializer
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from .utils import update_secret_key
from rest_framework.views import APIView
from .palm import generate_adventure
from django.utils import timezone
from datetime import timedelta
from django.utils.crypto import get_random_string
from django.core.serializers import serialize
import json
from django.http import HttpResponse

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
            username = request.data['username']
            email = request.data['email']
            password = request.data['password']
            print("Creating new user: %s" % username)

            # Check if the username already exists in the database
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already in use'}, status=400)
                print("Username already in use")

            print("Username not in use")
            # Create the user if the username is unique
            user = User.objects.create_user(username, email, password)
            print("User record created")
            key = get_random_string(length=40)
            token = Odyssey_Token.objects.create(user=user, key=key, expires_at=timezone.now() + timedelta(days=1))
            print("Token created")
            token_data = serialize('json', [token])
            token_dict = json.loads(token_data)[0]
            serializer = UserSerializer(user)
            print("Serializer created")
            return Response({'user': serializer.data, 'token': token_dict}, status=200)
        except Exception as e:
            print("Unable to create user because %s" % e)
            return Response({'error': 'Unable to create user'}, status=400)


    # @login_required
    def partial_update(self, request, *args, **kwargs):
        print(request)
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
                print("Updating email")
                user = self.get_object()
                print(user)
                new_email = {'email': request.data['email'], 'username': request.data['email']}
                print(new_email)
                serializer = self.get_serializer(user, data=new_email, partial=True)
                print("serialized data")
                serializer.is_valid(raise_exception=True)
                print("validated serializer")
                self.perform_update(serializer)
            except Exception as e:
                print("Unable to update email because %s" % e)
                return Response({'error': 'Unable to update email'}, status=500)

        user = User.objects.get(pk=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)
    
    def login(self, request):
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user is not None:
            login(request, user)
            key = get_random_string(length=40)
            token = Odyssey_Token.objects.create(user=user, key=key, expires_at=timezone.now() + timedelta(days=1))
            token_data = serialize('json', [token])  # Serialize the token object
            token_dict = json.loads(token_data)[0]
            return Response(token_dict, status=200)
        else:
            return Response({'error': 'Invalid email or password'}, status=401)
    
    def logout(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=200)

# class AdventureViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
class AdventureViewSet(viewsets.ModelViewSet):

    queryset = Adventure.objects.select_related('user_id').prefetch_related('scene_set')
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
            queryset = queryset.prefetch_related('scene_set').filter(user_id=user_id)
        
        return queryset


# class SceneViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
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
# class EncounterViewSet(LoginRequiredMixin, viewsets.ModelViewSet):

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
    def post(self, request):
        data = request.data
        campaign_setting = data.get('campaign_setting')
        level = data.get('level')
        experience = data.get('experience')
        context = data.get('context')
        
        adventure = generate_adventure(data['game'], data['players'], data['scenes'], data['encounters'], data['plot_twists'], data['clues'], campaign_setting, level, experience, context).strip('"```json\\n').rstrip('\\n```"')

        adventure_dict = json.loads(adventure)
        serialized_adventure = json.dumps(adventure_dict)

        return HttpResponse(serialized_adventure, content_type='application/json')