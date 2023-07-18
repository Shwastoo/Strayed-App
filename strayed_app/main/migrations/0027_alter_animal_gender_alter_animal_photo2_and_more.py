# Generated by Django 4.2.3 on 2023-07-18 09:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0026_alter_animal_gender_alter_animal_photo2_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animal',
            name='gender',
            field=models.CharField(choices=[('F', 'Samica'), ('M', 'Samiec')], max_length=20),
        ),
        migrations.AlterField(
            model_name='animal',
            name='photo2',
            field=models.ImageField(blank=True, upload_to='main/static/images/uploads'),
        ),
        migrations.AlterField(
            model_name='animal',
            name='photo3',
            field=models.ImageField(blank=True, upload_to='main/static/images/uploads'),
        ),
    ]
