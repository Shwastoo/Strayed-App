# Generated by Django 4.2.3 on 2023-12-17 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0038_animal_status_alter_animal_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animal',
            name='gender',
            field=models.CharField(choices=[('Samiec', 'M'), ('Samica', 'F')], max_length=20),
        ),
        migrations.AlterField(
            model_name='animal',
            name='status',
            field=models.CharField(choices=[('Zaginiony', 'L'), ('Znaleziony', 'F')], max_length=20),
        ),
    ]
