from django.shortcuts import render, redirect
from django.views.generic import View
from .models import SellerProfile
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpRequest


class SellerForm(View):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return render(request, 'index.html')
        else:
            return redirect('/')


def verified_seller(user):
    try:
        get_user = SellerProfile.objects.get(user=user)
        if get_user.is_phone_verified:
            return True
        else:
            return False
    except ObjectDoesNotExist:
        return False


class SellerDashBoard(View):
    def get(self, request, *args, **kwargs):
        if verified_seller(request.user):
            return render(request, 'index.html')
        else:
            return HttpRequest()


class AddProduct(View):
    def get(self, request, *args, **kwargs):
        if verified_seller(request.user):
            return render(request, 'index.html')
        else:
            return HttpRequest()
