from django.db import models
from .adventure import Adventure
from .scene import Scene
from .encounter import Encounter

class Custom_Field(models.Model):
    safe_text_validator = Adventure.safe_text_validator
    
    adventure_id = models.ForeignKey(Adventure, on_delete=models.CASCADE)
    scene_id = models.ForeignKey(Scene, on_delete=models.CASCADE)
    encounter_id = models.ForeignKey(Encounter, on_delete=models.CASCADE)
    name = models.CharField(max_length = 80, validators = [safe_text_validator])
    value = models.TextField(blank = True, validators = [safe_text_validator])