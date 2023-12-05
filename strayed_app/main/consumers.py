import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Chat
from django.shortcuts import get_object_or_404
from .serializers import ChatSerializer
class TextRoomConsumer(WebsocketConsumer):
    def connect(self):

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        # Receive message from WebSocket
        text_data_json = json.loads(text_data)
        msg = text_data_json['msg']
        sender = text_data_json['sender']
        msgtype = text_data_json['msgtype']
        timestamp = text_data_json['timestamp']
        chatroom = text_data_json['chatroom']

        queryset = Chat.objects.all()
        chat = get_object_or_404(queryset, chatID=chatroom)
        del text_data_json['chatroom']
        chat.messages.append(text_data_json)
        chat.save()
        serializer = ChatSerializer(data=chat)

        if serializer.is_valid():
            serializer.save()
            
        print(chat.messages)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'msg': msg,
                'sender': sender,
                'msgtype': msgtype,
                'timestamp': timestamp
            }
        )

    def chat_message(self, event):
        # Receive message from room group
        msg = event['msg']
        sender = event['sender']
        msgtype = event['msgtype']
        timestamp = event['timestamp']
        print(event)

        newMSG = {
            'msg': msg,
            'sender': sender,
            'msgtype': msgtype,
            'timestamp': timestamp
        }


        # Send message to WebSocket
        self.send(text_data=json.dumps(newMSG))