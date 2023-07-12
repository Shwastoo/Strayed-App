from typing import Any, Dict
from django.db import models
from django.db.models.query import QuerySet
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from .models import Animal
from django.conf import settings
from .forms import newAnimalForm
from django.contrib.auth.models import User
import os

# Create your views here.

class IndexView(generic.ListView):
    template_name = "main/index.html"
    context_object_name = "strayed_animals"

    def get_queryset(self):
        return Animal.objects.all()
    
class DetailsView(generic.DetailView):
    model = Animal
    template_name = "main/details.html"
    #extra_context = {
    #    'img_path': settings.IMG_ROOT
    #}

    def get_queryset(self):
        return Animal.objects.all()
    '''
    def get_context_data(self, **kwargs):
        context = super(DetailsView, self).get_context_data(**kwargs)
        context.update(self.extra_context)
        return context

    '''
    def get_img_path(self):
        return os.path.dirname(__file__)+str(Animal.photo)
    
def newAnimal(request):
    form = newAnimalForm()
    return render(request, "main/new.html", {"form":form})

def addAnimal(request, ownerID=None):
    if request.method == 'POST':
        if ownerID == None:
            ownerID = 1
        an = Animal(
            title=request.POST["title"],
            desc=request.POST["desc"],
            photo=request.FILES["photo"],
            species=request.POST["species"],
            breed=request.POST["breed"],
            colors=request.POST["colors"].split(","),
            location=request.POST["location"],
            age=request.POST["age"],
            owner=User.objects.get(pk=ownerID)
        )
        an.save()
        an.save(update_fields=["static_url","slug"])
    return HttpResponseRedirect(reverse("main:animals"))   