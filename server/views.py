from datetime import timedelta
from django.conf import settings
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator, default_token_generator
from django.core.mail import send_mail
from django.core.serializers import serialize
from django.core.signing import TimestampSigner, BadSignature
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.decorators import method_decorator
from django.utils.encoding import force_bytes, force_str
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.generic.base import View
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from server.models import Adventure, Scene, Encounter, Custom_Field, Odyssey_Token
from server.serializers import AdventureSerializer, UserSerializer, SceneSerializer, EncounterSerializer, CustomFieldSerializer
from .utils import update_secret_key, login_required_ajax, LoginRequiredMixinAjax
from .palm import generate_adventure
import json

# Create your views here.


def home(request):
    context = {}
    return render(request, "index.html", context)

# class CheckAuthenticatedView(APIView):
#     def get(self, request, format=None):
#         user = self.request.user
#         try:
#             isAuthenticated = user.is_authenticated

#             if isAuthenticated:
#                 return Response({ 'isAuthenticated': 'success' }, status=200)
#             else:
#                 return Response({ 'isAuthenticated': 'error' }, status=400)
#         except:
#             return Response({ 'error': 'Oops! Something went wrong when checking authentication status.'}, status=500)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            return Response({'success': 'CSRF cookie set'}, status=200)
        except:
            return Response({'error': 'Oops! Something went wrong getting a CSRF token.'}, status=500)


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
            newUser = User.objects.create_user(username, email, password)
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
            key = get_random_string(length=40)
            token = Odyssey_Token.objects.create(
                user=user, key=key, expires_at=timezone.now() + timedelta(days=1))
            token_data = serialize('json', [token])
            token_dict = json.loads(token_data)[0]
            serializer = UserSerializer(newUser)
            return Response({'user': serializer.data, 'token': token_dict}, status=200)
        except Exception as e:
            print("Unable to create user because %s" % e)
            return Response({'error': 'Unable to create user'}, status=400)

    @login_required_ajax
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
                new_email = {
                    'email': request.data['email'], 'username': request.data['email']}
                serializer = self.get_serializer(
                    user, data=new_email, partial=True)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
            except Exception as e:
                print("Unable to update email because %s" % e)
                return Response({'error': 'Unable to update email'}, status=500)

        user = User.objects.get(pk=request.user.id)
        serializer = UserSerializer(user)
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
        return Response(serializer.data, status=200)

    @action(detail=False, methods=['post'])
    def login(self, request):
        try:
            user = authenticate(
                username=request.data['username'], password=request.data['password'])
            if user is not None:
                login(request, user)
                key = get_random_string(length=40)
                try:
                    token = Odyssey_Token.objects.get(user_id=user.id)
                except Odyssey_Token.DoesNotExist:
                    token = Odyssey_Token.objects.create(
                        user=user, key=key, expires_at=timezone.now() + timedelta(days=1))
                if token.is_expired():
                    Odyssey_Token.objects.filter(user_id=user.id).delete()
                    token = Odyssey_Token.objects.create(
                        user=user, key=key, expires_at=timezone.now() + timedelta(days=1))
                token_data = serialize('json', [token])
                token_dict = json.loads(token_data)[0]
                return Response({'success': 'User authenticated', 'token': token_dict, 'username': request.data['username']}, status=200)
            else:
                return Response({'error': 'Invalid email or password'}, status=401)
        except Exception as e:
            print("Unable to log in user because %s" % e)
            return Response({'error': 'Oops! Something went wrong logging in the user'}, status=500)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            Odyssey_Token.objects.filter(
                user_id=request.data['user_id']).delete()
            logout(request)
            return Response({'message': 'Logout successful'}, status=200)
        except Exception as e:
            print("Unable to log out user because %s" % e)
            return Response({'error': 'Something went wrong when logging out'}, status=500)


class AdventureViewSet(LoginRequiredMixinAjax, viewsets.ModelViewSet):
    # class AdventureViewSet(viewsets.ModelViewSet):

    # queryset = Adventure.objects.select_related('user_id').prefetch_related('scene_set__encounter_set')
    serializer_class = AdventureSerializer

    def get_queryset(self):
        queryset = Adventure.objects.all()
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset.prefetch_related('scene_set__encounter_set')

    # @action(detail=False, methods=['GET'])
    # def get_user_adventures(self, request):
    #     try:
    #         user_id = request.query_params.get('user_id')
    #         print("User: %s\tviews 150" % user_id)
    #         adventures = Adventure.objects.filter(user_id = user_id).prefetch_related('scene_set__encounter_set')
    #         serializer = AdventureSerializer(adventures, many=True)
    #         return Response(serializer.data, status=200)
    #     except Exception as e:
    #         print("Unable to retrieve user's adventures because %s" % e)
    #         return Response({ 'error': 'Something went wrong when retrieving the user\'s adventures' }, status=500)

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print("Unable to update adventure because %s" % e)
            return Response({'error': 'Something went wrong when updating adventure'}, status=500)


class SceneViewSet(LoginRequiredMixinAjax, viewsets.ModelViewSet):
    # class SceneViewSet(viewsets.ModelViewSet):

    queryset = Scene.objects.all().prefetch_related('encounter_set')
    serializer_class = SceneSerializer

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print("Unable to update scene because %s" % e)
            return Response({'error': 'Something went wrong when updating scene'}, status=500)


class EncounterViewSet(LoginRequiredMixinAjax, viewsets.ModelViewSet):
    # class EncounterViewSet(LoginRequiredMixin, viewsets.ModelViewSet):

    queryset = Encounter.objects.all()
    serializer_class = EncounterSerializer

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print("Unable to update encounter because %s" % e)
            return Response({'error': 'Something went wrong when updating encounter'}, status=500)


class CustomFieldViewSet(LoginRequiredMixinAjax, viewsets.ModelViewSet):

    queryset = Custom_Field.objects.all()
    serializer_class = CustomFieldSerializer

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print("Unable to update custom field because %s" % e)
            return Response({'error': 'Something went wrong when updating custom field'}, status=500)


class GenerateAdventureView(APIView):
    # Supposedly generate_adventure runs synchronously. If this causes problems, try using async await.
    @login_required_ajax
    def post(self, request):
        try:
            data = request.data
            campaign_setting = data.get("campaign_setting")
            level = data.get("level")
            experience = data.get("experience")
            context = data.get("context")
            print("Context: ", context)

            adventure = generate_adventure(data["game"], data["players"], data["scenes"], data["encounters"], data["plot_twists"], data["clues"], campaign_setting, level, experience, context).strip('"```json\\n').rstrip('\\n```"')

            adventure_dict = json.loads(adventure)
            serialized_adventure = json.dumps(adventure_dict)

            return HttpResponse(serialized_adventure, content_type="application/json")
        except Exception as e:
            print("Unable to generate adventure because %s" % e)
            return Response({'error': 'Something went wrong when generating adventure'}, status=500)


class CustomPasswordResetView(APIView):
    authentication_classes = []  # Allow unauthenticated access
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def post(self, request, *args, **kwargs):
        try:
            email = request.data.get('email')
            user = User.objects.get(email=email)

            # Generate reset token
            token_generator = TimestampSigner()
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.sign(uid)

            # Send email using your custom email template
            reset_url = f"{request.scheme}://{request.get_host()}/password/reset/confirm/{uid}/{token}/"

            context = {
                'protocol': request.scheme,
                'domain': request.META['HTTP_HOST'],
                'reset_url': reset_url,
            }
            email_subject = 'Password Reset Request'
            email_body = render_to_string(
                'registration/password_reset_email.html', context)
            send_mail(
                subject=email_subject,
                # Strip HTML tags for plain text email
                message=strip_tags(email_body),
                from_email='admin@omegagamingstudios.com',  # The "from" email address
                recipient_list=[email],  # List of recipient email addresses
                fail_silently=False,
                # Email username (EMAIL_HOST_USER)
                auth_user=settings.EMAIL_HOST_USER,
                # Email password (EMAIL_HOST_PASSWORD)
                auth_password=settings.EMAIL_HOST_PASSWORD,
                connection=None,  # Use the default email connection
                html_message=email_body,  # Set the HTML content of the email
            )

            return JsonResponse({'message': 'Password reset email sent'}, status=200)
        except Exception as e:
            print("Unable to send password reset email because %s" % e)
            return Response({'error': 'Something went wrong when sending password reset email'}, status=500)


# @method_decorator(csrf_exempt, name='dispatch')
class CustomPasswordResetConfirmView(APIView):
    authentication_classes = []  # Allow unauthenticated access
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def post(self, request):
        User = get_user_model()

        # Get the uidb64 and token from the request data
        uidb64 = request.data.get('uidb64')
        token = request.data.get('token')

        try:
            # uid = force_str(urlsafe_base64_decode(uidb64))
            uid = urlsafe_base64_decode(uidb64)
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        token_generator = TimestampSigner()

        try:
            uid = token_generator.unsign(token, max_age=3600)
        except BadSignature:
            return JsonResponse({'error': 'Invalid password reset link'}, status=400)

        # If the user and token are valid, update the user's password
        password = request.data.get('password')
        user.set_password(password)
        user.save()

        return JsonResponse({'message': 'Password reset confirmation successful'}, status=200)
