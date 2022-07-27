from .models import *
from rest_framework import serializers


class ProductTreeSer(serializers.ModelSerializer):

    class Meta:
        model = ProductTrees
        fields = "__all__"
