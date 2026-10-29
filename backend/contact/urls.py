from django.urls import path
from .views import ContactRequestList, ContactRequestDetail

urlpatterns = [
    path('', ContactRequestList.as_view(), name='contact_request_list'),
    path(
        '<int:pk>/',
        ContactRequestDetail.as_view(),
        name='contact_request_detail'
    ),
]