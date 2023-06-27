from django.db import models
from .scene import Scene

class Encounter(models.Model):
    progress_choices = Scene.progress_choices
    safe_text_validator = Scene.safe_text_validator

    scene_id = models.ForeignKey(Scene, on_delete=models.CASCADE)
    encounter_type = models.CharField(max_length = 31, blank = True, validators = [safe_text_validator])
    description = models.TextField(blank = True, validators = [safe_text_validator])
    stats = models.TextField(blank = True, validators = [safe_text_validator])
    progress = models.CharField(max_length = 15, choices = progress_choices, default = 'Not Started')

    class Meta:
        db_table = 'encounter'