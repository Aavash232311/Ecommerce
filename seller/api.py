from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .forms import SellerProfileForm
import random
from twilio.rest import Client
from .models import SellerProfile
from django.core.exceptions import ObjectDoesNotExist
from .searlizers import SellerInfoSer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class SellerInfoDetail(APIView):
    permission_classes = [IsAuthenticated]
    @classmethod
    def get_extra_actions(cls):
        return []

    def get(self, request):
        try:
            query_set = SellerProfile.objects.get(user=request.user)
            ser = SellerInfoSer(query_set, many=False)
            return Response(ser.data)
        except ObjectDoesNotExist:
            return Response({})


account_sid = "AC596115c44ecea3f297e39b911af9ec31"
account_token = "8ddacbe77e7c5e6d0221ef71737b93ef"
phone = "+19086501882"


@api_view(['POST'])
def verify_phone_number(request):
    code = int(request.data.get('code'))
    try:
        user = User.objects.get(username=request.user.username)
        user_profile = SellerProfile.objects.get(user=request.user)
        db_code = int(user_profile.otp)
        if db_code == code and int(user_profile.torque) < 5:
            user_profile.is_phone_verified = True
            user_profile.torque = 0
            user_profile.save()
            user.save()
            return Response({"error": True})
        else:
            user_profile.torque = int(user_profile.torque) + 1
            user_profile.save()
        return Response({
            "error": True
        })
    except ObjectDoesNotExist:
        return Response({})


@api_view(['POST'])
def snippet_list(request):
    # DOM ID AND DATABASE NAME OF THE FIELD MAY CORRESPOND
    # TO EACH OTHER FOR DYNAMIC ATTRIBUTES AND FLEXIBILITY SINCE REACT SUCKS
    files = ['jpg', 'jpeg', 'png', 'JPG']
    if request.method == 'POST':
        valid = SellerProfileForm(request.data)
        request_dict = request.data
        sms_required = True
        if valid.is_valid():
            user = User.objects.get(id=request.user.id)
            awaits = valid.save(commit=False)
            # if form needs to be updated
            updating = False
            try:
                awaits = SellerProfile.objects.get(user=request.user)
                # check if already sms verified
                updating = True
                if awaits.is_phone_verified:
                    sms_required = False
            except ObjectDoesNotExist:
                pass
            awaits.user = user

            # valid image file extension
            def valid_image(img):
                check_images = str(img).split('.')[1]
                try:
                    files.index(check_images)
                    return True
                except ValueError:
                    return False

            for key, value in request_dict.items():

                types = awaits._meta.get_field(key).get_internal_type()
                if updating and types != "FileField":
                    setattr(awaits, key, value)
                    awaits.save()
                try:
                    if types == "FileField":
                        correct_format = valid_image(value)
                        if not correct_format:
                            print(correct_format, valid_image(value), value, "Incorrect format", types)
                            return Response({
                                "message": False
                            })
                        if correct_format:
                            if value is not None:
                                setattr(awaits, key, value)
                except IndexError:
                    pass
            user.seller = awaits
            user.save()
            if not updating:
                awaits.save()
            # SMS verification after successfully saved
            if sms_required:
                user_profile = SellerProfile.objects.get(user=request.user)
                phone_number = request.data.get('contact_number')
                if phone_number is not None and len(phone_number) == 10:
                    try:
                        if int(user_profile.torque) <= 5:
                            send_sms(phone_number, request.user, False)
                            return Response({
                                "verified": True
                            })

                    except ObjectDoesNotExist:
                        return Response({"message": False})
                else:
                    return Response({
                        "message": False
                    })
            else:
                return Response({
                    "verified": True
                })

        else:
            return Response(valid.errors.as_json())
        return Response({})


@api_view(['POST'])
def resend_sms(request):
    phone_number = request.data.get('phone_number')
    if phone_number is not None and len(phone_number) > 0:
        send_sms(phone_number, request.user, True)
        return Response({"message": True})
    else:
        return Response({"message": False})


def send_sms(phone_number, user, resend):
    user_profile = SellerProfile.objects.get(user=user)
    if resend:
        user_profile.resend_torque = int(user_profile.resend_torque) + 1

    otp_code = random.randint(1000, 9999)
    user_profile.otp = otp_code
    user_profile.save()
    client = Client(account_sid, account_token)
    message = f'Hi there to verify your seller profile in DeepBasket account enter the ' \
              f'following token: {otp_code} '
    client.messages.create(
        body=message,
        from_=phone,
        to="+977" + phone_number
    )


class SaveProductForm(APIView):
    @classmethod
    def get_extra_actions(cls):
        return []

    def post(self, request, *args, **kwargs):
        print("Hello world")
        return Response({})

    def get(self, request, *args, **kwargs):
        return Response({})