from django.urls import path
from .views import ServiceList, ServiceDetail


urlpatterns = [
    path('', ServiceList.as_view(), name='service_list'),
    path('<int:pk>/', ServiceDetail.as_view(), name='service_detail'),
]