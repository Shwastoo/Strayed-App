from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.utils.text import slugify
# Create your models here.



class Animal(models.Model):
    class Ages(models.TextChoices):
        PUPPY = "Szczenię",_("PP")
        ADULT = "Dorosły",_("AD")
        ELDER = "Staruszek",_("EL")

    title = models.CharField(max_length=50)
    desc = models.CharField(max_length=1000)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="main/static/images/uploads")
    static_url = models.CharField(max_length=500, blank=True)
    species = models.CharField(max_length=50)
    breed = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    age = models.CharField(max_length=20, choices=Ages.choices)
    slug = models.SlugField(unique=True, blank=True)

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse("details", kwargs={"slug": self.slug})
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.title+" "+str(self.pk))
        self.static_url = self.photo.url.removeprefix("/main/static")
        self.age
        super(Animal, self).save(*args, **kwargs)
    
