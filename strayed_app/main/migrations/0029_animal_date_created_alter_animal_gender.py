# Generated by Django 4.2.3 on 2023-07-29 08:45

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0028_remove_animal_static_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='animal',
            name='date_created',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2023, 7, 29, 8, 45, 10, 660322, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='animal',
            name='gender',
            field=models.CharField(choices=[('M', 'Samiec'), ('F', 'Samica')], max_length=20),
        ),
    ]
