from typing import Any, Dict
from django.db import models
from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404, get_list_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from .models import Animal, Chat, ChatImage
from django.conf import settings
#from .forms import newAnimalForm, loginForm, registerForm
from django.contrib.auth.models import User
from django.utils import timezone
import os, json
from rest_framework import viewsets
from .serializers import AnimalSerializer, UserSerializer, ChatSerializer, ChatImageSerializer
from .models import Animal
from django.http import JsonResponse
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST
from django.middleware.csrf import get_token
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import json

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
    serializer_class = AnimalSerializer
    queryset = Animal.objects.all()
    lookup_field = 'slug'

    def list(self, request):
        queryset = Animal.objects.all()
        serializer = AnimalSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, slug):
        queryset = Animal.objects.all()
        animal = get_object_or_404(queryset, slug=slug)
        serializer = AnimalSerializer(animal)
        #print(serializer.data)
        querysetUser = User.objects.all()
        newData = serializer.data.copy()
        newData["owner"] = get_object_or_404(querysetUser, pk=newData["owner"]).username
        #print(newData)
        return Response(newData)
    
    def create(self, request):
        newData = request.data.copy()
        queryset = User.objects.all()
        newData["owner"]=get_object_or_404(queryset, username=newData["owner"]).pk
        if newData["photo2"]=="null":
            newData["photo2"]=""
        if newData["photo3"]=="null":
            newData["photo3"]=""
        #newData["colors"]=newData["colors"].split(",")
        #print(newData["colors"])
        serializer = AnimalSerializer(data=newData)
        if serializer.is_valid():
            serializer.save()
            #serializer.save(update_fields=["slug"])
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

'''
class DetailView(viewsets.ModelViewSet):
    serializer_class = AnimalSerializer
    queryset = Animal.objects.all()
    lookup_field = 'slug'
'''

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'username'

class ChatView(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()
    lookup_field = 'chatID'
    
    def retrieve(self, request, chatID):

        if "~" in chatID:
            try:
                queryset = Chat.objects.all()
                chat = get_object_or_404(queryset, chatID=chatID)
                serializer = ChatSerializer(chat)
                #print(chat)
                return Response(serializer.data)
            except:
                newChat = {}
                newChat["chatID"] = chatID
                newChat["messages"] = []
                serializer = ChatSerializer(data=newChat)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            #queryset = Chat.objects.filter()
            #print("TEST")
            chatsA = Chat.objects.filter(chatID__contains=("~"+chatID)).values()
            chatsB = Chat.objects.filter(chatID__contains=(chatID+"~")).values()
            #print(chatsA, chatsB)
            #chatsA = get_list_or_404(Chat, chatID__contains=("~"+chatID))
            #chatsB = get_list_or_404(Chat, chatID__contains=(chatID+"~"))
            chats = chatsA.union(chatsB)
            '''
            for c in chats:
                if len(c["messages"]) == 0:
                    #chats.remove(c)
                    chats.exclude(c)
            '''
            #print(chats)
            serializer = ChatSerializer(chats, many=True)
            #print(chat)
            return Response(serializer.data)

class ChatImagesView(viewsets.ModelViewSet):
    serializer_class = ChatImageSerializer
    queryset = ChatImage.objects.all()


'''
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
'''
'''
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

    #def get_context_data(self, **kwargs):
    #    context = super(DetailsView, self).get_context_data(**kwargs)
    #    context.update(self.extra_context)
    #    return context

'''


#@ensure_csrf_cookie
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    response.set_cookie('CSRFtoken', response["X-CSRFToken"])
    return response

@csrf_exempt
@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    print(data)

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    try:
        user = authenticate(username=username, password=password)
    except:
        print("auth attempt")
    

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.'})

@csrf_exempt
@require_POST
def register_view(request):
    '''
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    '''
    data = json.loads(request.body)
    uname = data.get('username')
    password = data.get('password')
    pass_conf = data.get('confirm_password')
    fname = data.get('first_name')
    lname = data.get('last_name')
    email = data.get("email")
    error_msg = ""
    user = User.objects.filter(username=uname)
    if not user:
        user = User.objects.filter(email=email)
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
                return HttpResponse("Account created.")
            else:
                return HttpResponse("Passwords don't match.", status=400)
        else:
            return HttpResponse("Email already used.", status=400)
    else:
        return HttpResponse("Username unavailable.", status=400)
    
@require_POST
def change_pass(request):
    data = json.loads(request.body)
    uname = data.get('username')
    old_pass = data.get('oldPass')
    password = data.get('newPass')
    pass_conf = data.get('confirmPass')
    user = User.objects.get(username=uname)
    print(uname, user)
    if user:
        passMatch = user.check_password(old_pass)
        if passMatch:
            if old_pass!=password:
                user.set_password(password)
                user.save()
                return HttpResponse("Account created.")
            else:
                return HttpResponse("Same password.", status=400)
        else:
            return HttpResponse("Wrong password.", status=400)
    else:
        return HttpResponse("Username unavailable.", status=400)


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

'''
def newAnimal(request):
    form = newAnimalForm()
    return render(request, "main/new.html", {"form":form})
'''

'''
@require_POST
def addAnimal(request, ownerID=None):
    serializer = AnimalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        
'''