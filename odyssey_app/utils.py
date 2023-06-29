from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
import re

class CharacterTypesValidator:
    def validate(self, password, user=None):
        if not re.search(r'[a-z]+', password) or not re.search(r'[A-Z]+', password) or not re.search(r'\d+'):
            raise ValidationError(
                _('Password must contain at least one uppercase letter, one lowercase letter, and one number.')
            )
    
    def get_help_text(self):
        return _(
            'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
        )