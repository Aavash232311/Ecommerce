from django.urls import path
from . import views


urlpatterns = [
    path('basic_info_api', views.Authenticated.as_view())
]