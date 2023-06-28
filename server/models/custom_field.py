from django.db import models
from .adventure import Adventure
from .scene import Scene
from .encounter import Encounter
from django.core.exceptions import ValidationError

class Custom_Field(models.Model):
    safe_text_validator = Adventure.safe_text_validator
    
    adventure_id = models.ForeignKey(Adventure, blank=True, null=True, on_delete=models.CASCADE)
    scene_id = models.ForeignKey(Scene, blank=True, null=True, on_delete=models.CASCADE)
    encounter_id = models.ForeignKey(Encounter, blank=True, null=True,on_delete=models.CASCADE)
    name = models.CharField(max_length = 80, validators = [safe_text_validator])
    value = models.TextField(blank = True, validators = [safe_text_validator])

    def clean(self):
        if not self.adventure_id and not self.scene_id and not self.encounter_id:
            raise ValidationError('A custom field must belong to an adventure, a scene, or an encounter.')
        super().clean()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'custom_field'