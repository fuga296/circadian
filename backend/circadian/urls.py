from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserRetrieveUpdateView, DiaryCreateView, DiaryRetrieveUpdateDestroyView, DiaryBlocksListView, DiaryListListView, DiariesByMonthListView, DiariesExistenceListView, DiaryHistoryListView, AllDiaryHistoryListView, DiaryHistoryCreateView, LogCreateView, ProtectedView

urlpatterns = [
    path('user/', UserRetrieveUpdateView.as_view(), name="get_update_user"),

    path('diary/create/', DiaryCreateView.as_view(), name="create_diary"),
    path('diary/<int:year>-<int:month>-<int:day>/', DiaryRetrieveUpdateDestroyView.as_view(), name="get_update_delete_diary"),
    path('diary/<int:year>-<int:month>/', DiariesByMonthListView.as_view(), name="get_diaries_by_month"),
    path('diary/blocks/', DiaryBlocksListView.as_view(), name="get_diary_blocks"),
    path('diary/list', DiaryListListView.as_view(), name="get_diary_list"),
    path('diary/existence/', DiariesExistenceListView.as_view(), name="get_diary_existence_list"),

    path('history/create/', DiaryHistoryCreateView.as_view(), name='create_history'),
    path('history/<int:year>-<int:month>-<int:day>/', DiaryHistoryListView.as_view(), name='get_diary_history'),
    path('history/all/', AllDiaryHistoryListView.as_view(), name='get_user_history'),

    path('log/create/', LogCreateView.as_view(), name='create_log'),

    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', ProtectedView.as_view(), name='protected'),
]