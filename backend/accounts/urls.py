from django.urls import path
from .views import ProfileView,LogoutView,RegisterView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
]