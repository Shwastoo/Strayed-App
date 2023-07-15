from django import forms
from .models import Animal

class newAnimalForm(forms.Form):
    title = forms.CharField(max_length=50, widget=forms.Textarea)
    desc = forms.CharField(max_length=1000, widget=forms.Textarea)
    photo = forms.ImageField()
    species = forms.CharField(max_length=50)
    breed = forms.CharField(max_length=50)
    colors = forms.CharField(max_length=50)
    location = forms.CharField(max_length=50)
    '''age = forms.ChoiceField(
        widget=forms.Select,
        choices=Animal.Ages.choices, 
    )'''
    gender = forms.ChoiceField(
        widget=forms.Select,
        choices=Animal.Genders.choices, 
    )   