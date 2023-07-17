import os
import random
import string
from django.contrib.sessions.models import Session
from django.contrib.auth import update_session_auth_hash, get_user_model
from django.conf import settings
from django.utils.encoding import force_str, force_bytes
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin

def login_required_ajax(view_func):
    def wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated:
            return view_func(request, *args, **kwargs)
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

    # Rotate session keys and update session hashes
    for session in sessions:
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
