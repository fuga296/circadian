from rest_framework import serializers
from .models import User, Diary, History, Log
import uuid
import base64

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'password': {'write_only': True, 'required': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['userID'] = user.id
        return token

class DiarySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    sequence_number = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    class Meta:
        model = Diary
        fields = ['id', 'user', 'sequence_number', 'date', 'main_text', 'progress', 'memo', 'todos', 'files', 'created_at', 'updated_at', 'front_id']

    def get_user(self, obj):
        return obj.user.username

    def get_sequence_number(self, obj):
        return Diary.objects.filter(date__lt=obj.date, user=obj.user).count() + 1

    def get_created_at(self, obj):
        return obj.created_at.strftime('%Y-%m-%dT%H:%M:%S')

    def get_updated_at(self, obj):
        return obj.updated_at.strftime('%Y-%m-%dT%H:%M:%S')

    def generate_url_path(self):
        return str(uuid.uuid4())

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        files = representation.get('files', [])
        for media in files:
            if 'binaryData' in media and media['binaryData']:
                if isinstance(media['binaryData'], bytes):
                    media['binaryData'] = base64.b64encode(media['binaryData']).decode('utf-8')
        return representation

    def to_internal_value(self, data):
        internal_value = super().to_internal_value(data)
        files = internal_value.get('files', [])
        for media in files:
            if 'binaryData' in media and isinstance(media['binaryData'], str):
                media['binaryData'] = base64.b64decode(media['binaryData'])
            if 'url' not in media or not media['url']:
                media['url'] = str(uuid.uuid4())
        return internal_value

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class HistorySerializer(serializers.ModelSerializer):
    diary_date = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = ['id', 'diary', 'diary_date', 'timestamp', 'type', 'main_text_diff', 'progress_diff', 'memo_diff', 'todos_diff', 'files_diff']
        read_only_fields = ['id', 'timestamp']

    def get_diary_date(self, obj):
        return obj.diary.date

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ['user', 'status', 'detail', 'ip_address']