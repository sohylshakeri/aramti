from django.db import transaction
from rest_framework import serializers

from .models import HomeStat, Client, Testimonial

class HomeStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeStat
        fields = [
            'key',
            'value',
            'plus',
            'order',
        ]

class TestimonialSubmissionSerializer(serializers.Serializer):
    display_name = serializers.CharField(max_length=150)

    contact_email = serializers.EmailField()

    company = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True,
    )

    country = serializers.CharField(max_length=100)

    city = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
    )

    text = serializers.CharField()

    publication_consent = serializers.BooleanField(required=True)

    def create(self, validated_data):
        publication_consent = validated_data.pop(
            'publication_consent'
        )

        # ایجاد مشتری و نظر باید به‌صورت یک تراکنش انجام شود.
        with transaction.atomic():
            client = Client.objects.create(
                display_name=validated_data['display_name'],
                contact_email=validated_data['contact_email'],
                company=validated_data.get('company', ''),
                country=validated_data['country'],
                city=validated_data.get('city', ''),

                # موقعیت نقشه را مدیر بعداً تعیین می‌کند.
                is_approved=False,
                show_on_map=False,

                # اجازه انتشار باید صریحاً ثبت شود.
                publication_consent=publication_consent,
            )

            testimonial = Testimonial.objects.create(
                client=client,
                text=validated_data['text'],
                publication_consent=publication_consent,
                is_approved=False,
            )

        return testimonial

class PublicClientSerializer(serializers.ModelSerializer):
    map_x = serializers.FloatField(read_only=True)
    map_y = serializers.FloatField(read_only=True)
    avatar = serializers.ImageField(read_only=True)

    class Meta:
        model = Client
        fields = [
            'id',
            'display_name',
            'company',
            'country',
            'city',
            'collaboration_summary',
            'map_x',
            'map_y',
            'avatar',
        ]    

class PublicTestimonialSerializer(serializers.ModelSerializer):
    client = PublicClientSerializer(read_only=True)

    class Meta:
        model = Testimonial
        fields = [
            'id',
            'text',
            'created_at',
            'client',
        ]

class PublicClientSerializer(serializers.ModelSerializer):
    map_x = serializers.FloatField(read_only=True)
    map_y = serializers.FloatField(read_only=True)
    avatar = serializers.ImageField(read_only=True)

    class Meta:
        model = Client
        fields = [
            'id',
            'display_name',
            'company',
            'country',
            'city',
            'collaboration_summary',
            'map_x',
            'map_y',
            'avatar',
        ]


class PublicTestimonialSerializer(serializers.ModelSerializer):
    client = PublicClientSerializer(read_only=True)

    class Meta:
        model = Testimonial
        fields = [
            'id',
            'text',
            'created_at',
            'client',
        ]
