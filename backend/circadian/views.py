from rest_framework import status, generics, pagination
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from datetime import date
from .serializers import UserSerializer, DiarySerializer, DiaryListSerializer, DiaryByMonthSerializer, DiaryExistenceSerializer, HistorySerializer, LogSerializer
from .models import Diary, History, Log
from .utils.search.dsl_parser import parse_dsl

# User
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user

        except ValueError as e:
            raise NotFound("Invalid user")
        except Exception as e:
            raise NotFound(f"An unexpected error occurred: {str(e)}")


# Diary
# OK
class DiaryCreateView(generics.CreateAPIView):
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return response

        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DiaryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            year = int(self.kwargs.get('year'))
            month = int(self.kwargs.get('month'))
            day = int(self.kwargs.get('day'))
            target_date = date(year, month, day)

            # 存在しないときはNoneを返す
            return Diary.objects.filter(user=self.request.user, date=target_date).first()

        except ValueError as e:
            raise NotFound("Invalid date")
        except Exception as e:
            raise NotFound(f"An unexpected error occurred: {str(e)}")

    def retrieve(self, request, *args, **kwargs):
        try:
            diary = self.get_object()
            if not diary:
                return Response(None, status=status.HTTP_200_OK)

            serializer = self.get_serializer(diary)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except NotFound as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except NotFound as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DiaryBlocksPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class DiaryBlocksListView(generics.ListAPIView):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DiaryBlocksPagination

    def get_queryset(self):
        try:
            qs = Diary.objects.filter(user=self.request.user)

            dsl_query = self.request.GET.get("search-text", "").strip()
            if dsl_query:
                q_obj, sort_fields = parse_dsl(dsl_query)
                qs = qs.filter(q_obj)
                if sort_fields:
                    qs = qs.order_by(*sort_fields)

            return qs
        except Exception as e:
            raise NotFound(f"An unexpected error occurred: {str(e)}")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response([], status=status.HTTP_200_OK)

        try:
            page = self.paginate_queryset(queryset)
        except NotFound:
            return Response([], status=status.HTTP_200_OK)

        serializer = self.get_serializer(page, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DiaryListPagination(pagination.PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 300

class DiaryListListView(generics.ListAPIView):
    serializer_class = DiaryListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DiaryListPagination

    def get_queryset(self):
        try:
            return Diary.objects.filter(user=self.request.user)
        except Exception as e:
            raise NotFound(f"An unexpected error occurred: {str(e)}")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response([], status=status.HTTP_200_OK)

        try:
            page = self.paginate_queryset(queryset)
        except NotFound:
            return Response([], status=status.HTTP_200_OK)

        serializer = self.get_serializer(page, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DiariesByMonthListView(generics.ListAPIView):
    serializer_class = DiaryByMonthSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            year = int(self.kwargs.get('year'))
            month = int(self.kwargs.get('month'))

            queryset = Diary.objects.filter(
                user=self.request.user,
                date__year=year,
                date__month=month,
            )
            return queryset

        except ValueError as e:
            raise NotFound("Invalid date")
        except Exception as e:
            raise NotFound(f"An unexpected error occurred: {str(e)}")

class DiariesExistenceListView(generics.ListAPIView):
    serializer_class = DiaryExistenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            return Diary.objects.filter(user=self.request.user).only('date')
        except Exception as e:
            raise NotFound(f"An unexpected error occurred: {str(e)}")


# history
class DiaryHistoryCreateView(generics.CreateAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            diary_date = request.data.get('diary_date')

            diary = Diary.objects.filter(user=request.user, date=diary_date).first()
            if not diary:
                raise NotFound("Invalid date")

            action = request.data.get('action')
            text = request.data.get('text')
            progress = request.data.get('progress')
            memo = request.data.get('memo')
            todos = request.data.get('todos')
            file_names = request.data.get('file_names')
            file_types = request.data.get('file_types')
            file_urls = request.data.get('file_urls')

            if not action:
                raise ValidationError("Action is required")

            serializer = self.get_serializer(data={
                'diary': diary.diary_id,
                'action': action,
                'text': text,
                'progress': progress,
                'memo': memo,
                'todos': todos,
                'file_names': file_names,
                'file_types': file_types,
                'file_urls': file_urls,
            })

            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except NotFound as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DiaryHistoryPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class DiaryHistoryListView(generics.ListAPIView):
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DiaryHistoryPagination

    def get_queryset(self):
        try:
            year = int(self.kwargs.get('year'))
            month = int(self.kwargs.get('month'))
            day = int(self.kwargs.get('day'))
            target_date = date(year, month, day)

            return History.objects.filter(diary__user=self.request.user, diary__date=target_date)

        except (ValueError, TypeError) as e:
            raise NotFound("Invalid date")
        except Exception as e:
            raise NotFound(f"An unexpected error occurred: {str(e)}")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response([], status=status.HTTP_200_OK)

        try:
            page = self.paginate_queryset(queryset)
        except NotFound:
            return Response([], status=status.HTTP_200_OK)

        serializer = self.get_serializer(page, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllDiaryHistoryListView(generics.ListAPIView):
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DiaryHistoryPagination

    def get_queryset(self):
        try:
            return History.objects.filter(diary__user=self.request.user)
        except Exception as e:
            raise NotFound(f"An unexpected error occurred: {str(e)}")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response([], status=status.HTTP_200_OK)

        try:
            page = self.paginate_queryset(queryset)
        except NotFound:
            return Response([], status=status.HTTP_200_OK)

        serializer = self.get_serializer(page, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# log
class LogCreateView(generics.CreateAPIView):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    permission_classes = [IsAuthenticated]

    def get_client_ip(self):
        try:
            x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = self.request.META.get('REMOTE_ADDR')
            return ip
        except Exception as e:
            raise ValidationError(f"IP address: {str(e)}")

    def create(self, request, *args, **kwargs):
        try:
            user = request.user.user_id
            action = request.data.get('action')
            detail = request.data.get('detail')
            ip_address = self.get_client_ip()
            device_info = request.data.get('device_info')

            serializer = self.get_serializer(data={
                'user': user,
                'action': action,
                'detail': detail,
                'ip_address': ip_address,
                'device_info': device_info,
            })

            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a protected view"})