from datetime import timedelta
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import render
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from server.models import Adventure, Scene, Encounter, Custom_Field, Odyssey_Token
from server.serializers import AdventureSerializer, UserSerializer, SceneSerializer, EncounterSerializer, CustomFieldSerializer
from .utils import update_secret_key
from .palm import generate_adventure
import json

# Create your views here.
def home(request):
    context = {}
    return render(request, "index.html", context)

@method_decorator(csrf_protect, name='dispatch')
class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        try:
            isAuthenticated = User.is_authenticated

            if isAuthenticated:
                return Response({ 'isAuthenticated': 'success' }, status=200)
            else:
                return Response({ 'isAuthenticated': 'error' }, status=400)
        except:
            return Response({ 'error': 'Oops! Something went wrong when checking authentication status.'}, status=500)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            return Response({ 'success': 'CSRF cookie set' }, status=200)
        except:
            return Response({ 'error': 'Oops! Something went wrong getting a CSRF token.'}, status=500)

@method_decorator(csrf_protect, name='dispatch')
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny, )
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        try:
            username = request.data['username']
            email = request.data['email']
            password = request.data['password']

            # Check if the username already exists in the database
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already in use'}, status=400)
                
            # Create the user if the username is unique
            user = User.objects.create_user(username, email, password)
            key = get_random_string(length=40)
            token = Odyssey_Token.objects.create(user=user, key=key, expires_at=timezone.now() + timedelta(days=1))
            token_data = serialize('json', [token])
            token_dict = json.loads(token_data)[0]
            serializer = UserSerializer(user)
            return Response({'user': serializer.data, 'token': token_dict}, status=200)
        except Exception as e:
            print("Unable to create user because %s" % e)
            return Response({'error': 'Unable to create user'}, status=400)


    @login_required
    def partial_update(self, request, *args, **kwargs):
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
                user = self.get_object()
                new_email = {'email': request.data['email'], 'username': request.data['email']}
                serializer = self.get_serializer(user, data=new_email, partial=True)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
            except Exception as e:
                print("Unable to update email because %s" % e)
                return Response({'error': 'Unable to update email'}, status=500)

        user = User.objects.get(pk=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        try:
            user = authenticate(username=request.data['username'], password=request.data['password'])
            if user is not None:
                login(request, user)
                key = get_random_string(length=40)
                try:
                    token = Odyssey_Token.objects.get(user_id=user.id)
                except Odyssey_Token.DoesNotExist:
                    token = Odyssey_Token.objects.create(user=user, key=key, expires_at=timezone.now() + timedelta(days=1))
                if token.is_expired():
                    Odyssey_Token.objects.filter(user_id=user.id).delete()
                    token = Odyssey_Token.objects.create(user=user, key=key, expires_at=timezone.now() + timedelta(days=1))  
                token_data = serialize('json', [token])
                token_dict = json.loads(token_data)[0]
                return Response({ 'success': 'User authenticated', 'token': token_dict, 'username': request.data['username'] }, status=200)
            else:
                return Response({'error': 'Invalid email or password'}, status=401)
        except Exception as e:
            print("Unable to log in user because %s" % e)
            return Response({'error': 'Oops! Something went wrong logging in the user'}, status=500)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            Odyssey_Token.objects.filter(user_id=request.data['user_id']).delete()
            logout(request)
            return Response({'message': 'Logout successful'}, status=200)
        except Exception as e:
            print("Unable to log out user because %s" % e)
            return Response({ 'error': 'Something went wrong when logging out' }, status=500)

class AdventureViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
# class AdventureViewSet(viewsets.ModelViewSet):

    queryset = Adventure.objects.select_related('user_id').prefetch_related('scene_set__encounter_set')
    serializer_class = AdventureSerializer

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print("Unable to update adventure because %s" % e)
            return Response({ 'error': 'Something went wrong when updating adventure'}, status=500)

class SceneViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
# class SceneViewSet(viewsets.ModelViewSet):

    queryset = Scene.objects.all().prefetch_related('encounter_set')
    serializer_class = SceneSerializer

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print("Unable to update scene because %s" % e)
            return Response({ 'error': 'Something went wrong when updating scene' }, status=500)

class EncounterViewSet(viewsets.ModelViewSet):
# class EncounterViewSet(LoginRequiredMixin, viewsets.ModelViewSet):

    queryset = Encounter.objects.all()
    serializer_class = EncounterSerializer

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print("Unable to update encounter because %s" % e)
            return Response({ 'error': 'Something went wrong when updating encounter' }, status=500)

class CustomFieldViewSet(LoginRequiredMixin, viewsets.ModelViewSet):

    queryset = Custom_Field.objects.all()
    serializer_class = CustomFieldSerializer

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print("Unable to update custom field because %s" % e)
            return Response({'error': 'Something went wrong when updating custom field' }, status=500)

class GenerateAdventureView(APIView):
    # Supposedly generate_adventure runs synchronously. If this causes problems, try using async await.
    def post(self, request):
        try:
            data = request.data
            campaign_setting = data.get('campaign_setting')
            level = data.get('level')
            experience = data.get('experience')
            context = data.get('context')
            
            adventure = generate_adventure(data['game'], data['players'], data['scenes'], data['encounters'], data['plot_twists'], data['clues'], campaign_setting, level, experience, context).strip('"```json\\n').rstrip('\\n```"')

            adventure_dict = json.loads(adventure)
            serialized_adventure = json.dumps(adventure_dict)

            return HttpResponse(serialized_adventure, content_type='application/json')
        except Exception as e:
            print("Unable to generate adventure because %s" % e)
            return Response({ 'error': 'Something went wrong when generating adventure' }, status=500)