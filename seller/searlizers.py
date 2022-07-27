from .models import *
from rest_framework import serializers


class SellerInfoSer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = "__all__"


