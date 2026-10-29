from rest_framework import permissions
from rest_framework import generics
from .models import TeamMember
from .serializers import TeamMemberSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_authenticated and request.user.is_staff

class TeamMemberList(generics.ListCreateAPIView):
    queryset=TeamMember.objects.all()
    serializer_class=TeamMemberSerializer
    permission_classes=[IsAdminOrReadOnly]


class TeamMemberDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=TeamMember.objects.all()
    serializer_class=TeamMemberSerializer
    permission_classes=[IsAdminOrReadOnly]