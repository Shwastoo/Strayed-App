from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

# Create your models here.



class Animal(models.Model):
    class Ages(models.TextChoices):
        PUPPY = "PP",_("Szczenię")
        ADULT = "AD",_("Dorosły")
        ELDER = "EL",_("Staruszek")

    title = models.CharField(max_length=100)
    desc = models.CharField(max_length=1000)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="imgs")
    species = models.CharField(max_length=50)
    breed = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    age = models.CharField(max_length=20, choices=Ages.choices)

    


    def __str__(self):
        return self.title
