from rest_framework import serializers
from .models import Animal

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ('id', 'title', 'desc', 'owner', 'photo', 'photo2', 'photo3', 'static_urls',
                  'species', 'breed', 'colors', 'location', 'gender', 'slug', 'date_created')