# Generated by Django 4.2.3 on 2023-07-10 08:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_animal_static_url_alter_animal_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='animal',
            name='static_url',
        ),
        migrations.AlterField(
            model_name='animal',
            name='slug',
            field=models.SlugField(blank=True, unique=True),
        ),
    ]