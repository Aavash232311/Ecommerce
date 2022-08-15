from django.contrib.auth.models import User
from django.db import models

objects = [
    ('Liquid', 'Liquid'),
    ('Battery', 'Battery'),
    ('Flammable', 'Flammable'),
    ('Sensitive', 'Sensitive'),
    ('None', 'None')
]


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
    product_types = models.ManyToManyField('self', null=True, blank=True)
    product_description = models.TextField(max_length=3000, null=True, blank=True)
    img_0 = models.ImageField(null=True, blank=True)
    img_1 = models.ImageField(null=True, blank=True)
    img_2 = models.ImageField(null=True, blank=True)
    img_3 = models.ImageField(null=True, blank=True)
    img_4 = models.ImageField(null=True, blank=True)
    img_5 = models.ImageField(null=True, blank=True)
    img_6 = models.ImageField(null=True, blank=True)
    delivery_by_seller = models.BooleanField(default=False, null=True, blank=True)
    available = models.BooleanField(default=False, null=True, blank=True)
    cash_on_delivery = models.BooleanField(default=False, null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    width = models.FloatField(null=True, blank=True)
    breadth = models.FloatField(null=True, blank=True)
    stock = models.IntegerField(null=True, blank=True)
    price = models.FloatField(null=True, blank=True)
    object_type = models.CharField(max_length=50, null=True, blank=True, choices=objects)
    upload_date = models.DateField(auto_now_add=True, auto_now=False, null=True)
    discount = models.IntegerField(null=True, blank=True)
    discount_valid = models.CharField(max_length=50, null=True, blank=True)
