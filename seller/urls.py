from . import views
from django.urls import path
from . import api
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path("seller_form", views.SellerForm.as_view()),
    path('uploadProfile/', api.snippet_list),
    path("validCode/", api.verify_phone_number),
    path("SellerProfile/", api.SellerInfoDetail.as_view()),
    path("smsReq/", api.resend_sms),
    path("SellerDashboard", views.SellerDashBoard.as_view()),
    path("add_product", views.AddProduct.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
