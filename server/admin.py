from django.contrib import admin
from .models import Adventure, Scene, Encounter, Custom_Field

# Register your models here.
admin.site.register(Adventure)
admin.site.register(Scene)
admin.site.register(Encounter)
admin.site.register(Custom_Field)