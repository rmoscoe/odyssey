# Generated by Django 4.2.2 on 2023-07-30 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0009_alter_encounter_scene_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adventure',
            name='status',
            field=models.CharField(choices=[('active', 'active'), ('archived', 'archived')], default='active', max_length=10),
        ),
    ]
