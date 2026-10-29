from django.urls import path
from .views import TeamMemberList, TeamMemberDetail

urlpatterns = [
    path('', TeamMemberList.as_view(), name='team_list'),
    path('<int:pk>/', TeamMemberDetail.as_view(), name='team_detail'),
]