from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.utils.text import slugify
from django_jsonform.models.fields import ArrayField
from django.utils import timezone

# Create your models here.



class Animal(models.Model):
    class Genders(models.TextChoices):
        FEMALE = "F", "Samica",
        MALE = "M", "Samiec",
    
    GENDER = {
        ("F","Samica"),
        ("M","Samiec")
    }

    title = models.CharField(max_length=50)
    desc = models.CharField(max_length=1000)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="images/uploads")
    photo2 = models.ImageField(upload_to="images/uploads", blank=True)
    photo3 = models.ImageField(upload_to="images/uploads", blank=True)
    #static_url = models.CharField(max_length=500, blank=True)
    static_urls = ArrayField(models.CharField(max_length=500, blank=True), default=list, blank=True)
    species = models.CharField(max_length=50)
    breed = models.CharField(max_length=50)
    colors = ArrayField(models.CharField(max_length=50), default=list)
    location = models.CharField(max_length=50)
    gender = models.CharField(max_length=20, choices=GENDER)
    slug = models.SlugField(unique=True, blank=True)
    date_created = models.DateTimeField(blank=True)

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse("details", kwargs={"slug": self.slug})
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.title+" "+str(self.pk))
        #self.static_url = self.photo.url.removeprefix("/main/static")
        self.date_created = timezone.now()
        
        static_urls = ["","",""]
        if self.photo != "":
            static_urls[0] = self.photo.url.removeprefix("/main/static")
            if self.photo2 != "":
                static_urls[1] = self.photo2.url.removeprefix("/main/static")
                if self.photo3 != "":
                    static_urls[2] = self.photo3.url.removeprefix("/main/static")

        self.static_urls = static_urls
        super(Animal, self).save(*args, **kwargs)
    
