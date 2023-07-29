from typing import Any, Dict
from django.db import models
from django.db.models.query import QuerySet
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from .models import Animal
from django.conf import settings
from .forms import newAnimalForm, loginForm, registerForm
from django.contrib.auth.models import User
from django.utils import timezone
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
    
def newAnimal(request):
    form = newAnimalForm()
    return render(request, "main/new.html", {"form":form})

def addAnimal(request, ownerID=None):
    if request.method == 'POST':
        if ownerID == None:
            ownerID = 1
        try:
            photo2 = request.FILES["photo2"]
        except:
            photo2 = ""
            pass
        try:
            photo3 = request.FILES["photo3"]
        except:
            photo3 = ""
            pass
        an = Animal(
            title=request.POST["title"],
            desc=request.POST["desc"],
            photo=request.FILES["photo"],
            photo2=photo2,
            photo3=photo3,
            species=request.POST["species"],
            breed=request.POST["breed"],
            colors=request.POST["colors"].split("\n"),
            location=request.POST["location"],
            gender=request.POST["gender"],
            owner=User.objects.get(username = request.session.get("user")),
            date_created=timezone.now()
        )
        an.save()
        an.save(update_fields=["static_urls","slug"])
    return HttpResponseRedirect(reverse("main:animals"))   

def login(request):
    form = loginForm()
    return render(request, "main/login.html", {"form":form})

def register(request):
    formReg = registerForm()
    return render(request, "main/register.html", {"formReg":formReg})

def userAuth(request):
    if request.method == 'POST':
        uname = request.POST.get("un")
        password = request.POST.get("pw")
        user = User.objects.filter(username=uname)
        error_msg = ""
        if user:
            user = user[0]
            if user.check_password(password):
                request.session['user'] = uname
                return HttpResponseRedirect(reverse("main:animals"))
            else:
                error_msg = "Nieprawidłowe hasło"
        else:
            error_msg = "Użytkownik o takim loginie nie istnieje."
        return render(request, "main/login.html", {"form":loginForm(), "errorLog":error_msg})
    
def userRegister(request):
    if request.method == 'POST':
        uname = request.POST.get("un")
        password = request.POST.get("pw")
        pass_conf = request.POST.get("pw_conf")
        fname = request.POST.get("fn")
        lname = request.POST.get("ln")
        email = request.POST.get("email")
        error_msg = ""
        user = User.objects.filter(username=uname)
        if not user:
            if password == pass_conf:
                newUser = User(
                    username=uname,
                    email=email,
                    first_name=fname,
                    last_name=lname,
                )
                newUser.set_password(password)
                newUser.save()
                error_msg = "Konto utworzone, możesz się zalogować"
                return render(request, "main/login.html", {"form":loginForm(), "errorLog":error_msg})
            else:
                error_msg = "Hasła nie są takie same"
        else:
            error_msg = "Ten login jest już zajęty przez innego użytkownika"
        return render(request, "main/register.html", {"formReg":registerForm(), "errorReg":error_msg})
        

def logout(request):
    try:
        del request.session["user"]
        return HttpResponseRedirect(reverse("main:animals"))
    except KeyError:
        pass
        return HttpResponseRedirect(reverse("main:animals"))
        