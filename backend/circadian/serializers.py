import re
import uuid
from rest_framework import serializers
from .models import User, Diary, History, Log

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'password': {'write_only': True, 'required': True},
        }

    # バリデート
    def validate_username(self, value):
        if not 3 <= len(value) < 64:
            raise serializers.ValidationError("ユーザーネームは3字以上64字未満です")
        if re.search(r'[^a-zA-Z0-9._-]', value):
            raise serializers.ValidationError("半角英数字、ドット、アンダースコア、ハイフン以外の文字は使用できません")
        return value

    def validate_email(self, value):
        pattern = r'^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
        if not re.match(pattern, value):
            raise serializers.ValidationError("正当なメールアドレスではありません")
        return value

    def validate_password(self, value):
        if not 8 <= len(value) < 128:
            raise serializers.ValidationError("パスワードは8字以上128字未満です")
        if not re.search(r'[a-zA-Z]', value):
            raise serializers.ValidationError("パスワードには基本ラテン文字を1字以上含めてください")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("パスワードには数字を1字以上含めてください")
        if re.search(r'[^a-zA-Z0-9!#$%&^~|@+*]', value):
            raise serializers.ValidationError("パスワードには半角英数字、特殊記号(!, #, $, %, &, ^, ~, |, @, +, *)以外の文字は使用できません")
        return value

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
    username = serializers.SerializerMethodField()
    sequence_number = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    class Meta:
        model = Diary
        fields = ['username', 'sequence_number', 'date', 'text', 'progress', 'memo', 'todos', 'file_names', 'file_types', 'file_urls', 'created_at', 'updated_at', 'front_id']

    def validate(self, data):
        file_names = data.get('file_names')
        file_types = data.get('file_types')
        file_urls = data.get('file_urls')
        if not len(file_names) == len(file_types) == len(file_urls):
            raise serializers.ValidationError("ファイルが不正です")
        return data

    def get_username(self, obj):
        return obj.user.username

    def get_sequence_number(self, obj):
        return Diary.objects.filter(date__lt=obj.date, user=obj.user).count() + 1

    def get_created_at(self, obj):
        return obj.created_at.strftime('%Y-%m-%dT%H:%M:%S')

    def get_updated_at(self, obj):
        return obj.updated_at.strftime('%Y-%m-%dT%H:%M:%S')

    def get_front_id(self, obj):
        return str(uuid.uuid4())

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('username', None)
        validated_data.pop('date', None)
        return super().update(instance, validated_data)

class DiaryListSerializer(serializers.ModelSerializer):
    sequence_number = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Diary
        fields = ['sequence_number', 'date', 'text', 'created_at']

    def get_username(self, obj):
        return obj.user.username

    def get_sequence_number(self, obj):
        return Diary.objects.filter(date__lt=obj.date, user=obj.user).count() + 1

    def get_created_at(self, obj):
        return obj.created_at.strftime('%Y-%m-%dT%H:%M:%S')

class DiaryByMonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['date', 'todos']

class DiaryExistenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['date']

class HistorySerializer(serializers.ModelSerializer):
    diary_date = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = ['history_id', 'diary', 'diary_date', 'timestamp', 'action', 'text', 'progress', 'memo', 'todos', 'file_names', 'file_types', 'file_urls']

    def get_diary_date(self, obj):
        return obj.diary.date

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ['user', 'action', 'detail', 'ip_address', 'device_info']

    def create(self, validated_data):
        return super().create(validated_data)