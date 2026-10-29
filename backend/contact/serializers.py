from rest_framework import serializers
from .models import ContactRequest
from services.models import Service

class ContactRequestSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.ChoiceField(
    choices=ContactRequest.Status.choices,
    required=False
)
    services = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Service.objects.all()
    )
    def validate(self, attrs):
        if 'status' in attrs:
            request = self.context['request']

            if not request.user.is_staff:
                raise serializers.ValidationError(
                    'Only staff users can change status.'
                )

        return attrs

    class Meta:
        model = ContactRequest
        fields = ['id','user', 'status', 'contact', 'message', 'services','name']