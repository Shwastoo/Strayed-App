# Generated by Django 4.2.3 on 2023-07-22 12:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0027_alter_animal_gender_alter_animal_photo2_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='animal',
            name='static_url',
        ),
    ]