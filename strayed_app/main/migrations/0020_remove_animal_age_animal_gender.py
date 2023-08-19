# Generated by Django 4.2.3 on 2023-07-14 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0019_alter_animal_photo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='animal',
            name='age',
        ),
        migrations.AddField(
            model_name='animal',
            name='gender',
            field=models.CharField(choices=[('F', 'Suka'), ('M', 'Pies')], default='Suka', max_length=20),
            preserve_default=False,
        ),
    ]