from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from seller.models import SellerProfile
from django.core.exceptions import ObjectDoesNotExist


# what this does are it encrypts username in the token
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        seller = True
        try:
            SellerProfile.objects.get(user__username=str(user))
        except ObjectDoesNotExist:
            seller = False

        if seller:
            token['username'] = user.username
        else:
            token['username'] = None
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


urlpatterns = [
    path('register_page', views.RegisterView.as_view(), name='registerPage'),
    path('register_form', views.RegisterAPI.as_view()),
    path(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
         views.activate, name='activate'),
    path('login', views.LoginPage.as_view(), name='loginPage'),
    path('login_form', views.LoginAPI.as_view()),
    path('LogOutUser', views.LogOutAPi.as_view()),
    path(r'token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path(r'token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
