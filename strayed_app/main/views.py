from typing import Any, Dict
from django.db import models
from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from .models import Animal
from django.conf import settings
from .forms import newAnimalForm, loginForm, registerForm
from django.contrib.auth.models import User
from django.utils import timezone
import os, json
from rest_framework import viewsets
from .serializers import AnimalSerializer
from .models import Animal
from django.http import JsonResponse
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.middleware.csrf import get_token
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

# Create your views here.

'''
class AnimalView(GenericAPIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        animals = Animal.objects.all()
        serializer = AnimalSerializer(animals, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        posts_serializer = AnimalSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
class AnimalView(viewsets.ModelViewSet):
    def list(self, request):
        queryset = Animal.objects.all()
        serializer = AnimalSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Animal.objects.all()
        animal = get_object_or_404(queryset, slug=pk)
        serializer = AnimalSerializer(animal)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = AnimalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    '''
    serializer_class = AnimalSerializer
    queryset = Animal.objects.all()
    lookup_field = 'slug'

    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    '''


class DetailView(viewsets.ModelViewSet):
    serializer_class = AnimalSerializer
    queryset = Animal.objects.all()
    lookup_field = 'slug'


class SessionView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({'isAuthenticated': True})


class WhoAmIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({'username': request.user.username})

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


@ensure_csrf_cookie
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    print(data)

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.'})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})

def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'username': request.user.username})

def newAnimal(request):
    form = newAnimalForm()
    return render(request, "main/new.html", {"form":form})

@require_POST
def addAnimal(request, ownerID=None):
    serializer = AnimalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return HttpResponseRedirect(reverse("main:animals")) 

    data = json.loads(request.body)

    if request.method == 'POST':
        if ownerID == None:
            ownerID = 1
        try:
            photo2 = data.get("photo2")
        except:
            photo2 = ""
            pass
        try:
            photo3 = data.get("photo3")
        except:
            photo3 = ""
            pass
        an = Animal(
            title= data.get("title"),
            desc=data.get("desc"),
            photo=data.get("photo"),
            photo2=photo2,
            photo3=photo3,
            species=data.get("species"),
            breed=data.get("breed"),
            colors=data.get("colors").split(","),
            location=data.get("location"),
            gender=request.POST["gender"],
            owner=User.objects.get(username = request.session.get("user")),
            date_created=timezone.now()
        )
        an.save()
        an.save(update_fields=["slug"])
    return HttpResponseRedirect(reverse("main:animals"))   

def login_form(request):
    form = loginForm()
    return render(request, "main/login.html", {"form":form})

def register_form(request):
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
        

def logout_old(request):
    try:
        del request.session["user"]
        return HttpResponseRedirect(reverse("main:animals"))
    except KeyError:
        pass
        return HttpResponseRedirect(reverse("main:animals"))
        
