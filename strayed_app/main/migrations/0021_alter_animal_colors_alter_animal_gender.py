# Generated by Django 4.2.3 on 2023-07-18 08:53

from django.db import migrations, models
import django_jsonform.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0020_remove_animal_age_animal_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animal',
            name='colors',
            field=django_jsonform.models.fields.ArrayField(base_field=models.CharField(max_length=50), default=list, size=None),
        ),
        migrations.AlterField(
            model_name='animal',
            name='gender',
            field=models.CharField(choices=[('M', 'Samiec'), ('F', 'Samica')], max_length=20),
        ),
    ]
