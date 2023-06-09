# Generated by Django 4.2.2 on 2023-06-28 02:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_adventure_campaign_setting'),
    ]

    operations = [
        migrations.AlterField(
            model_name='custom_field',
            name='adventure_id',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='server.adventure'),
        ),
        migrations.AlterField(
            model_name='custom_field',
            name='encounter_id',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='server.encounter'),
        ),
        migrations.AlterField(
            model_name='custom_field',
            name='scene_id',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='server.scene'),
        ),
    ]
