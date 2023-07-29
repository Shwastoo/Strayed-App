from django import forms
from .models import Animal

class newAnimalForm(forms.Form):
    title = forms.CharField(label="Tytuł", max_length=50, widget=forms.Textarea)
    desc = forms.CharField(label="Opis", max_length=1000, widget=forms.Textarea)
    photo = forms.ImageField(label="Zdjęcie")
    photo2 = forms.ImageField(label="Zdjęcie 2", required=False)
    photo3 = forms.ImageField(label="Zdjęcie 3", required=False)
    species = forms.CharField(label="Gatunek", max_length=50)
    breed = forms.CharField(label="Rasa", max_length=50)
    colors = forms.CharField(label="Kolory (każdy kolor w osobnej linii)", max_length=50, widget=forms.Textarea)
    location = forms.CharField(label="Miejscowość", max_length=50)
    gender = forms.ChoiceField(
        label="Płeć", widget=forms.Select,
        choices=Animal.Genders.choices, 
    )   

class loginForm(forms.Form):
    un = forms.CharField(label="Login")
    pw = forms.CharField(label="Hasło", widget=forms.PasswordInput)

class registerForm(forms.Form):
    fn = forms.CharField(label="Imię")
    ln = forms.CharField(label="Nazwisko")
    email = forms.EmailField(label="Adres email")
    un = forms.CharField(label="Login")
    pw = forms.CharField(label="Hasło", widget=forms.PasswordInput)
    pw_conf = forms.CharField(label="Powtórz hasło", widget=forms.PasswordInput)
