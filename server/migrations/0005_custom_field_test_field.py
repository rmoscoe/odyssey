# Generated by Django 4.2.2 on 2023-06-28 03:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0004_alter_custom_field_adventure_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='custom_field',
            name='test_field',
            field=models.CharField(blank=True, max_length=8, null=True),
        ),
    ]
