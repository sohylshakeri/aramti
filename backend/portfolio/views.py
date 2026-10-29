from django.http import HttpResponse 
from .serializers import ProjectSerializer
from rest_framework import permissions
from .models import Project
from rest_framework import generics

# Create your views here.
class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and  request.user == obj.author

class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated


class ProjectList(generics.ListCreateAPIView):
    permission_classes=[IsAuthenticatedOrReadOnly]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class =ProjectSerializer
    permission_classes=[IsOwner ]
    #lookup_field= 'id'




def hello (request):
    return HttpResponse ('Hello from portfolio')
