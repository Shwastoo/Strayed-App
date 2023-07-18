# Generated by Django 4.2.3 on 2023-07-18 09:01

from django.db import migrations, models
import django_jsonform.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0021_alter_animal_colors_alter_animal_gender'),
    ]

    operations = [
        migrations.AddField(
            model_name='animal',
            name='photos',
            field=django_jsonform.models.fields.ArrayField(base_field=models.ImageField(upload_to='main/static/images/uploads'), default=list, size=None),
        ),
        migrations.AlterField(
            model_name='animal',
            name='gender',
            field=models.CharField(choices=[('F', 'Samica'), ('M', 'Samiec')], max_length=20),
        ),
    ]
