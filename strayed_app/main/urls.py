from django.urls import path, re_path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static 
from django.contrib import admin
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'animals', views.AnimalView, 'animal')
router.register(r'users', views.UserView, 'user')
router.register(r'chats', views.ChatView, 'chat')
#router.register(r'animals/{slug}', views.DetailView, 'details')

app_name="main"
urlpatterns = [
    path('', views.IndexView.as_view(), name='animals'),
    path('new/', views.newAnimal, name="new"),
    path('add/', views.addAnimal, name="addAnimal"),
    path('userAuth/', views.userAuth, name="userAuth"),
    path('userRegister/', views.userRegister, name="userRegister"),
    path('logout_form/', views.logout, name='logout'),
    path('login_form/', views.login_form, name="login"),
    path('register_form/', views.register_form, name="register"),
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('register/', views.register_view, name='api-register'),
    path('session/', views.session_view, name='api-session'),
    path('whoami/', views.whoami_view, name='api-whoami'),
    path('<slug:slug>/', views.DetailsView.as_view(), name="details"),
    path('api/', include(router.urls)),
    #path('api/animals/', views.AnimalView.as_view(), name="animal"),
    #path('api/animals/<slug:slug>/', views.AnimalView.as_view(), name="animal")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
