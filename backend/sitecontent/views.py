from django.shortcuts import render
from rest_framework import generics
from .models import HomeStat
from .serializers import HomeStatSerializer
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from .models import Client, Testimonial
from .serializers import (
    PublicClientSerializer,
    PublicTestimonialSerializer,
    TestimonialSubmissionSerializer
)

# Create your views here.

class HomeStatListView(generics.ListAPIView):
    queryset = HomeStat.objects.all()
    serializer_class = HomeStatSerializer
    permission_classes = [AllowAny]

class TestimonialSubmissionView(generics.GenericAPIView):
    serializer_class = TestimonialSubmissionSerializer

    permission_classes = [AllowAny]
    authentication_classes = []

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'testimonial_submission'

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                'detail': (
                    'Your review has been submitted '
                    'and is awaiting approval.'
                )
            },
            status=status.HTTP_201_CREATED,
        )

class CustomerMapDataView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        # فقط مشتریانی که اجازه انتشار دارند و تأیید شده‌اند.
        clients = Client.objects.filter(
            is_approved=True,
            show_on_map=True,
            publication_consent=True,
            map_x__isnull=False,
            map_y__isnull=False,
        )

        # فقط نظرات تأییدشده‌ای که اجازه انتشار دارند.
        # مشتری مرتبط نیز باید مجاز به نمایش روی نقشه باشد.
        testimonials = (
            Testimonial.objects
            .select_related('client')
            .filter(
                is_approved=True,
                publication_consent=True,
                client__is_approved=True,
                client__show_on_map=True,
                client__publication_consent=True,
                client__map_x__isnull=False,
                client__map_y__isnull=False,
            )
        )

        client_data = PublicClientSerializer(
            clients,
            many=True,
            context={'request': request},
        ).data

        testimonial_data = PublicTestimonialSerializer(
            testimonials,
            many=True,
            context={'request': request},
        ).data

        return Response({
            'clients': client_data,
            'testimonials': testimonial_data,
        })
