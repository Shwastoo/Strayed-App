# Generated by Django 4.2.3 on 2023-07-18 09:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0025_alter_animal_static_urls'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animal',
            name='gender',
            field=models.CharField(choices=[('M', 'Samiec'), ('F', 'Samica')], max_length=20),
        ),
        migrations.AlterField(
            model_name='animal',
            name='photo2',
            field=models.ImageField(blank=True, null=True, upload_to='main/static/images/uploads'),
        ),
        migrations.AlterField(
            model_name='animal',
            name='photo3',
            field=models.ImageField(blank=True, null=True, upload_to='main/static/images/uploads'),
        ),
    ]
