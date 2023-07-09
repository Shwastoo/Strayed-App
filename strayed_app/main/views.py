from typing import Any, Dict
from django.db import models
from django.db.models.query import QuerySet
from django.shortcuts import render
from django.http import HttpResponse
from django.views import generic
from .models import Animal
from django.conf import settings
import os

# Create your views here.

def animals(request):
    return render(request, "main/index.html")

class IndexView(generic.ListView):
    template_name = "main/index.html"
    context_object_name = "strayed_animals"

    def get_queryset(self):
        return Animal.objects.all()
    
class DetailsView(generic.DetailView):
    model = Animal
    template_name = "main/details.html"
    extra_context = {
        #'img_path': os.path.abspath(os.path.join(os.path.dirname(__file__),'..',Animal.photo.url))
        'img_path': settings.IMG_ROOT
    }

    def get_queryset(self):
        return Animal.objects.all()

    def get_context_data(self, **kwargs):
        context = super(DetailsView, self).get_context_data(**kwargs)
        context.update(self.extra_context)
        return context

    def get_img_path(self):
        return os.path.dirname(__file__)+str(Animal.photo)