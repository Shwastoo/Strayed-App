from rest_framework import serializers
from .models import Animal, Chat
from django.contrib.auth.models import User

class ListFieldCharField(serializers.Field):
    def to_internal_value(self, data):
        print(data)
        data = data.split(",")
        return data

    def to_representation(self, value):
        #value = ",".join([str(element) for element in value])
        return value
    
class AnimalSerializer(serializers.ModelSerializer):
    #colors = serializers.ListField(child=serializers.CharField())
    colors = ListFieldCharField()
    class Meta:
        model = Animal
        fields = ('id', 'title', 'desc', 'owner', 'photo', 'photo2', 'photo3',
                  'species', 'breed', 'colors', 'location', 'gender', 'slug', 'date_created')
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }

class UserSerializer(serializers.ModelSerializer):
    animals = AnimalSerializer(many=True)
    class Meta:
        model = User
        fields = ('pk','username','password','email','first_name','last_name', 'animals')

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ('chatID', 'messages')