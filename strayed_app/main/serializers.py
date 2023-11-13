from rest_framework import serializers
from .models import Animal
from django.contrib.auth.models import User

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ('id', 'title', 'desc', 'owner', 'photo', 'photo2', 'photo3', 'static_urls',
                  'species', 'breed', 'colors', 'location', 'gender', 'slug', 'date_created')
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }

class UserSerializer(serializers.ModelSerializer):
    animals = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Animal.objects.all())
    class Meta:
        model = User
        fields = ('username','email','first_name','last_name')