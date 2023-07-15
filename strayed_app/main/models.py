from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.utils.text import slugify
from django.contrib.postgres.fields import ArrayField
# Create your models here.



class Animal(models.Model):
    class Genders(models.TextChoices):
        FEMALE = "F", "Suka",
        MALE = "M", "Pies",
    
    GENDER = {
        ("F","Suka"),
        ("M","Pies")
    }

    '''class Ages(models.TextChoices):
        PUPPY = "PP","Szczenię",
        ADULT = "AD","Dorosły",
        ELDER = "EL","Staruszek",
    
    AGE = {
        ("PP","Szczenię"),
        ("AD","Dorosły"),
        ("EL","Staruszek")
    }'''

    title = models.CharField(max_length=50)
    desc = models.CharField(max_length=1000)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="main/static/images/uploads")
    static_url = models.CharField(max_length=500, blank=True)
    species = models.CharField(max_length=50)
    breed = models.CharField(max_length=50)
    colors = ArrayField(models.CharField(max_length=50), default=list)
    location = models.CharField(max_length=50)
    #age = models.CharField(max_length=20, choices=AGE)
    gender = models.CharField(max_length=20, choices=GENDER)
    slug = models.SlugField(unique=True, blank=True)

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse("details", kwargs={"slug": self.slug})
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.title+" "+str(self.pk))
        self.static_url = self.photo.url.removeprefix("/main/static")
        super(Animal, self).save(*args, **kwargs)
    
