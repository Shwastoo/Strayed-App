# Generated by Django 4.2.3 on 2023-07-09 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_alter_animal_age'),
    ]

    operations = [
        migrations.AddField(
            model_name='animal',
            name='slug',
            field=models.SlugField(null=True),
        ),
        migrations.AlterField(
            model_name='animal',
            name='title',
            field=models.CharField(max_length=50),
        ),
    ]
