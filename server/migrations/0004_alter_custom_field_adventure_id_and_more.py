# Generated by Django 4.2.2 on 2023-06-28 02:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0003_alter_custom_field_adventure_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='custom_field',
            name='adventure_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='server.adventure'),
        ),
        migrations.AlterField(
            model_name='custom_field',
            name='encounter_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='server.encounter'),
        ),
        migrations.AlterField(
            model_name='custom_field',
            name='scene_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='server.scene'),
        ),
    ]
