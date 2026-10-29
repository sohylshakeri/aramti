from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import ContactRequest
from .serializers import ContactRequestSerializer


class IsOwnerOrStaff(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True

        return request.user == obj.user

class ContactRequestList(generics.ListCreateAPIView):
    serializer_class = ContactRequestSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ContactRequest.objects.all()

        return ContactRequest.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class ContactRequestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrStaff
    ]


