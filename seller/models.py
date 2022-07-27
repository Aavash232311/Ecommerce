from django.contrib.auth.models import User
from django.db import models


class SellerProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    shop_name = models.CharField(max_length=50, null=True, blank=True)
    seller_name = models.CharField(max_length=50, null=True, blank=True)
    seller_address = models.CharField(max_length=50, null=True, blank=True)
    seller_warehouse = models.CharField(max_length=50, null=True, blank=True)
    seller_email = models.CharField(max_length=100, null=False, blank=False)
    shop_profile = models.ImageField(null=True, blank=True)
    cover_profile = models.ImageField(null=True, blank=True)
    contact_number = models.IntegerField(null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    torque = models.IntegerField(null=True, blank=True, default=0)
    resend_torque = models.IntegerField(null=True, blank=True, default=0)


class Product(models.Model):
    add_product = models.CharField(max_length=255, null=True, blank=True)

