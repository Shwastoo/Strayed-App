from django.urls import path, re_path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static 
from django.contrib import admin
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'animals', views.AnimalView, 'animal')
#router.register(r'animals/{slug}', views.DetailView, 'details')

app_name="main"
urlpatterns = [
    path('', views.IndexView.as_view(), name='animals'),
    path('new/', views.newAnimal, name="new"),
    path('add/', views.addAnimal, name="addAnimal"),
    path('userAuth/', views.userAuth, name="userAuth"),
    path('userRegister/', views.userRegister, name="userRegister"),
    path('logout/', views.logout, name='logout'),
    path('login/', views.login, name="login"),
    path('register/', views.register, name="register"),
    path('<slug:slug>/', views.DetailsView.as_view(), name="details"),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
