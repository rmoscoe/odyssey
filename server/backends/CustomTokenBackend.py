from django.contrib.auth.backends import ModelBackend
from django.utils import timezone
from ..models import Token

class CustomTokenBackend(ModelBackend):
    def authenticate(self, request, token=None, **kwargs):
        try:
            custom_token = Token.objects.get(key=token)
            if custom_token.is_expired():
                return None 
            else:
                return custom_token.user 
        except Token.DoesNotExist:
            return None 
