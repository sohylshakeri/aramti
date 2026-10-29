from django.urls import path

from .views import HomeStatListView, TestimonialSubmissionView,CustomerMapDataView


urlpatterns = [
    path(
        'home-stats/',
        HomeStatListView.as_view(),
        name='home_stats',
    ),

    path(
        'testimonials/submit/',
        TestimonialSubmissionView.as_view(),
        name='testimonial_submit',
    ),
     path(
        'customer-map/',
        CustomerMapDataView.as_view(),
        name='customer_map',
    ),
]