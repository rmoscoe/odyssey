from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
import os
import random
import string
import time
from django.contrib.sessions.models import Session
from django.contrib.auth import update_session_auth_hash, get_user_model
from django.conf import settings
from django.utils.crypto import constant_time_compare
from django.utils.encoding import force_str, force_bytes
from django.utils.http import base36_to_int, int_to_base36
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator

def login_required_ajax(view_func):
    def wrapped_view(*args, **kwargs):
        request = args[1]
        print(request)
        if request.user.is_authenticated:
            return view_func(*args, **kwargs)
        else:
            return JsonResponse({'error': 'Authentication required.'}, status=401)
    return wrapped_view

class LoginRequiredMixinAjax(LoginRequiredMixin):
    def dispatch(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            return super().dispatch(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Authentication required.'}, status=401)

def rotate_session_keys():
    # Get all active sessions
    sessions = Session.objects.all()
    print(sessions)

    # Rotate session keys and update session hashes
    for session in sessions:
        print(session)
        session.cycle_key()
        session.save()

        # Update the session hash for the associated user
        user_id = session.get_decoded().get('_auth_user_id')
        if user_id:
            user = get_user_model().objects.get(pk=user_id)
            update_session_auth_hash(force_bytes(settings.SECRET_KEY), user)

    # Print a success message
    print('Session keys rotated successfully.')


def generate_secret_key(length=50):
    characters = string.ascii_letters + string.digits + string.punctuation
    return force_str(''.join(random.choice(characters) for _ in range(length)))


def update_secret_key():
    # Get the previous SECRET_KEY value
    previous_secret_key = force_str(os.getenv('SECRET_KEY'))

    # Move the previous SECRET_KEY to the beginning of SECRET_KEY_FALLBACKS
    fallbacks = os.getenv('SECRET_KEY_FALLBACKS', '').split(',')
    fallbacks.insert(0, previous_secret_key)
    os.environ['SECRET_KEY_FALLBACKS'] = ','.join(fallbacks)

    # Remove old SECRET_KEY values from the end of SECRET_KEY_FALLBACKS
    fallbacks = fallbacks[:1]
    os.environ['SECRET_KEY_FALLBACKS'] = ','.join(fallbacks)

    # Generate a new random SECRET_KEY
    new_secret_key = generate_secret_key()

    # Set the new SECRET_KEY as the environment variable
    os.environ['SECRET_KEY'] = force_str(new_secret_key)

    # Rotate session keys and update session hashes
    rotate_session_keys()

    # Print a success message
    print('Secret key updated successfully.')

# class CustomPasswordResetTokenGenerator(PasswordResetTokenGenerator):
#     def _make_hash_value(self, user, timestamp):
#         print("Making hash value")
#         print(f"{user.pk}\t utils 84")
#         print(f"{timestamp}\tutils 85")
#         # uidb36 = urlsafe_b64encode(force_bytes(user.pk))
#         # print(f"{uidb36}\tutils 87")
#         return f"{user.pk}-{timestamp}"
    
#     # def make_token(self, user):
#     #     print("Making token")
#     #     timestamp = int(time.time())
#     #     print(f"{timestamp}\t utils 93")
#     #     uidb36 = urlsafe_b64encode(force_bytes(user.pk))
#     #     print(f"{uidb36}\tutils 95")
#     #     return f"{uidb36.decode()}-{timestamp}"
    
#     def check_token(self, user, token):
#         print("Checking token")
#         print(f"{user}, {token}\t utils 100")
#         if not (user and token):
#             print("Returning False")
#             return False

#         try:
#             uidb36, timestamp_str = token.split('-')
#             print(f"{uidb36}, {timestamp_str}\tutils 107")
#             uid = urlsafe_base64_decode(uidb36).decode()
#             print(f"{uid}\tutils 109")
#             user = User.objects.get(pk=uid)
#             print(f"{user}\tutils 111")
#             timestamp = int(timestamp_str)
#             print(f"{timestamp}\tutils 113")

#             # Check that the token is valid, the timestamp is within the allowed time window, and days have not passed
#             print(f"{constant_time_compare(self.make_token(user), token)}\tutils 116")
#             print(f"{int(time.time())}\tutils 117")
#             if constant_time_compare(self.make_token(user), token) and int(time.time()) - timestamp <= 3600:
#                 return True

#         except (ValueError, User.DoesNotExist):
#             pass

#         return False

# custom_password_reset_token_generator = CustomPasswordResetTokenGenerator()