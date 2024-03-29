# Generated by Django 4.2.3 on 2023-12-03 22:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0035_alter_chat_chatid'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(upload_to='images/chat')),
            ],
        ),
        migrations.AlterField(
            model_name='animal',
            name='gender',
            field=models.CharField(choices=[('M', 'Samiec'), ('F', 'Samica')], max_length=20),
        ),
    ]
