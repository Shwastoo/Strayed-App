from django.db import models
from django.contrib.auth.models import User

# Create your models here.
'''
class Animal(models.Model):
    title = models.CharField(max_length=100)
    desc = models.CharField(max_length=1000)
    #owner = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="imgs")
'''