from .views import hello ,ProjectList ,ProjectDetail
from django.urls import path


urlpatterns = [
    path('', hello , name= 'hello'),
    path ('projects/', ProjectList.as_view() , name='project_list'),
    path('projects/<int:pk>/', ProjectDetail.as_view() , name='project_detail')
]