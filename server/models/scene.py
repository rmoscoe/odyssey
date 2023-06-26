from django.db import models
from .adventure import Adventure

class Scene(models.Model):
    progress_choices = ['Not Started', 'In Progress', 'Complete']
    safe_text_validator = Adventure.safe_text_validator

    adventure_id = models.ForeignKey(Adventure, on_delete=models.CASCADE)
    sequence = models.IntegerField()
    challenge = models.TextField(blank=True, validators=[safe_text_validator])
    setting = models.TextField(blank=True, validators=[safe_text_validator])
    plot_twist = models.TextField(blank=True, validators=[safe_text_validator])
    clue = models.TextField(blank=True, validators=[safe_text_validator])
    progress = models.CharField(max_length = 15, choices = progress_choices, default = 'Not Started')