from rest_framework.response import Response
from rest_framework.views import APIView
from seller.models import SellerProfile
from django.core.exceptions import ObjectDoesNotExist


class Authenticated(APIView):
    @classmethod
    def get_extra_actions(cls):
        return []

    def get(self, request, *args, **kwargs):
        auth = False
        staff = False
        if request.user.is_authenticated:
            auth = True
            if request.user.is_staff:
                staff = True
        verified_seller = True
        if request.user.is_authenticated:
            try:
                current_obj = SellerProfile.objects.get(user=request.user)
                if not current_obj.is_phone_verified:
                    verified_seller = False
            except ObjectDoesNotExist:
                verified_seller = False
        return Response({
            'auth': auth,
            'staff': staff,
            'seller': verified_seller
        })
