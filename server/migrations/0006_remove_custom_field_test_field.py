# Generated by Django 4.2.2 on 2023-06-28 03:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0005_custom_field_test_field'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='custom_field',
            name='test_field',
        ),
    ]