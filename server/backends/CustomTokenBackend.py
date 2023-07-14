from django.contrib.auth.backends import ModelBackend
from django.utils import timezone
from ..models import odyssey_token

class CustomTokenBackend(ModelBackend):
    def authenticate(self, request, token=None, **kwargs):
        try:
            custom_token = odyssey_token.objects.get(key=token)
            if custom_token.is_expired():
                return None 
            else:
                return custom_token.user 
        except:
            return None 
