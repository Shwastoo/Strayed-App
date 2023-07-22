from django.urls import path, re_path
from . import views
from django.conf import settings
from django.conf.urls.static import static 

app_name="main"
urlpatterns = [
    path('', views.IndexView.as_view(), name='animals'),
    path('new/', views.newAnimal, name="new"),
    path('add/', views.addAnimal, name="addAnimal"),
    path('userAuth/', views.userAuth, name="userAuth"),
    path('logout/', views.logout, name='logout'),
    path('login/', views.login, name="login"),
    path('<slug:slug>/', views.DetailsView.as_view(), name="details"),
] 
#+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
