from rest_framework import serializers
from .models import TeamMember
from django.contrib.auth.models import User


class TeamMemberSerializer(serializers.ModelSerializer):

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True
    )

    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        full_name = (
            f'{obj.user.first_name} {obj.user.last_name}'
        ).strip()

        return full_name or obj.user.username

    class Meta:
        model = TeamMember
        fields = [
            'id',
            'user',
            'user_id',
            'name',
            'specialty',
            'image'
        ]
        read_only_fields = ['id', 'user', 'name']