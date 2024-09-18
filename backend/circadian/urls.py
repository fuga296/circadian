from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CreateDiaryView, RetrieveDiaryByDateView, ListDiariesView, UpdateDiaryView, RetrieveUserView, UpdateUserView, CreateHistoryView, ListUserHistoryView, ListDiaryHistoryView, RetrieveHistoryContentView, CreateLog, FileDetailView, RegisterView, ProtectedView

urlpatterns = [
    path('diary/create/', CreateDiaryView.as_view(), name="create_diary"),
    path('diary/<int:year>-<int:month>-<int:day>/', RetrieveDiaryByDateView.as_view(), name="get_diary_by_date"),
    path('diary/', ListDiariesView.as_view(), name="get_diary"),
    path('diary/update/<str:date>/', UpdateDiaryView.as_view(), name="update_diary"),

    path('user/', RetrieveUserView.as_view(), name="get_user"),
    path('user/update/', UpdateUserView.as_view(), name="update_user"),

    path('history/create/', CreateHistoryView.as_view(), name='create_history'),
    path('history/user/', ListUserHistoryView.as_view(), name='get_user_history'),
    path('history/<int:year>-<int:month>-<int:day>/', ListDiaryHistoryView.as_view(), name='get_diary_history'),
    path('history/<str:id>/', RetrieveHistoryContentView.as_view(), name='get_history_content'),

    path('log/create/', CreateLog.as_view(), name='create_log'),

    path('file/<str:path>/', FileDetailView.as_view(), name='file'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('protected/', ProtectedView.as_view(), name='protected'),
]