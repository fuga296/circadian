from rest_framework import status, generics, permissions, mixins
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from datetime import date
from .serializers import UserSerializer, DiarySerializer, HistorySerializer, LogSerializer
from .models import User, Diary, History, Log
import base64

import logging
logger = logging.getLogger(__name__)

class CreateDiaryView(generics.CreateAPIView):
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        self.object = serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({'id': self.object.id}, status=status.HTTP_201_CREATED)

class RetrieveDiaryByDateView(generics.RetrieveAPIView):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        year = int(self.kwargs.get('year'))
        month = int(self.kwargs.get('month'))
        day = int(self.kwargs.get('day'))
        target_date = date(year, month, day)

        return Diary.objects.filter(user=self.request.user, date=target_date)

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"error": "NotFound"}, status=status.HTTP_200_OK)

        diary = queryset.first()
        serializer = self.get_serializer(diary)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListDiariesView(generics.ListAPIView):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"error": "NotFound"}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateDiaryView(generics.UpdateAPIView):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        date = self.kwargs.get('date')
        return Diary.objects.get(user=user, date=date)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class RetrieveUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UpdateUserView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateHistoryView(generics.CreateAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        diary_date = request.data.get('diary_date')
        diary_type = request.data.get('type')
        main_text_diff = request.data.get('main_text')
        progress_diff = request.data.get('progress')
        memo_diff = request.data.get('memo')
        todos_diff = request.data.get('todos')
        files_diff = request.data.get('files')

        diary = Diary.objects.get(user=request.user, date=diary_date)
        serializer = self.get_serializer(data={
            'diary': diary.id,
            'type': diary_type,
            'main_text_diff': main_text_diff,
            'progress_diff': progress_diff,
            'memo_diff': memo_diff,
            'todos_diff': todos_diff,
            'files_diff': files_diff,
        })
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ListUserHistoryView(generics.ListAPIView):
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return History.objects.filter(diary__user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"error": "NotFound"}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListDiaryHistoryView(generics.ListAPIView):
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        year = int(self.kwargs.get('year'))
        month = int(self.kwargs.get('month'))
        day = int(self.kwargs.get('day'))
        target_date = date(year, month, day)

        return History.objects.filter(diary__date=target_date)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"error": "NotFound"}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RetrieveHistoryContentView(generics.RetrieveAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        history_id = self.kwargs.get('id')
        return History.objects.get(id=history_id)


class CreateLog(generics.CreateAPIView):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    permission_classes = [IsAuthenticated]

    def get_client_ip(self):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip

    def create(self, request, *args, **kwargs):
        user = request.user.id
        request_status = request.data.get('status')
        detail = request.data.get('detail')
        ip_address = self.get_client_ip()

        serializer = self.get_serializer(data={
            'user': user,
            'status': request_status,
            'detail': detail,
            'ip_address': ip_address,
        })

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileDetailView(APIView):
    def get(self, request, path):
        logger.info(f"Fetching file for path: {path}")
        diaries = Diary.objects.filter(user=request.user)
        for diary in diaries:
            media = next((m for m in diary.files if m.get('url') == path), None)
            if media:
                logger.info(f"Found media: {media}")
                if 'binaryData' in media and media['binaryData']:
                    if isinstance(media['binaryData'], bytes):
                        media['binaryData'] = base64.b64encode(media['binaryData']).decode('utf-8')
                    logger.info(f"Binary data length: {len(media['binaryData'])}")
                else:
                    logger.warning("Binary data is missing or empty")
                return Response(media, status=status.HTTP_200_OK)

        logger.warning(f"Media not found for path: {path}")
        return Response({'error': 'メディアが見つかりません'}, status=status.HTTP_404_NOT_FOUND)

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a protected view"})
