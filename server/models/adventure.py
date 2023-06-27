from django.contrib.auth.models import User
from django.db import models
from django.core.validators import RegexValidator
import re

class Adventure(models.Model):
    statuses = [('active', 'active'), ('archived', 'archived')]
    safe_text_validator = RegexValidator(r'(drop database)|(drop table (adventure|custom_field|encounter|scene|user))', flags=re.IGNORECASE, inverse_match=True, message='That text is not allowed. Please revise your entry.')

    title = models.CharField(max_length = 255, validators=[safe_text_validator])
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    game = models.CharField(max_length = 80, validators=[safe_text_validator])
    exposition = models.CharField(max_length = 255, blank=True, validators=[safe_text_validator])
    incitement = models.TextField(blank=True, validators=[safe_text_validator])
    climax = models.TextField(blank=True, validators=[safe_text_validator])
    denoument = models.TextField(blank=True, validators=[safe_text_validator])
    progress = models.FloatField(default=0)
    status = models.CharField(max_length = 10, choices = statuses)

    class Meta:
        db_table = 'adventure'
        ordering = ['user_id', '-created_at']