from django.forms import ModelForm
from .models import SellerProfile


class SellerProfileForm(ModelForm):
    class Meta:
        model = SellerProfile
        fields = [
            'seller_name',
            'seller_email',
            'seller_warehouse',
            'seller_address',
            'contact_number',
            'shop_name'
        ]
