from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView
from .forms import CreateUser
from deepBasket import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.six import text_type


class RegisterView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')


class LoginPage(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')


class LogOutAPi(APIView):
    @classmethod
    def get_extra_actions(cls):
        return []

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({
            "redirect": True
        })


class LoginAPI(APIView):

    @classmethod
    def get_extra_actions(cls):
        return []

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        auth = authenticate(username=username, password=password)
        if auth is not None:
            login(request, auth)
            return Response({
                "login": True
            })
        else:
            return Response({
                "login": False,
                "message": "username or password incorrect"
            })


class RegisterAPI(APIView):

    @classmethod
    def get_extra_actions(cls):
        return []

    def post(self, request, *args, **kwargs):
        form = CreateUser(request.data)
        if not form.is_valid():
            return Response(form.errors.as_json())
        else:
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            this = get_current_site(request)
            username = form.cleaned_data.get('username')
            client_email = form.cleaned_data.get('email')
            send_conformation_email(this, user, username, client_email)
            return Response({
                'email_sent': True,
                'email': client_email,
                'username': form.cleaned_data.get('first_name')
            })


class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
                text_type(user.pk) + text_type(timestamp) + text_type(user.is_active)
        )


account_activation_token = TokenGenerator()


def send_conformation_email(domain, user, username, client_email):
    template = render_to_string('acc_register_mail.html', {
        'name': username,
        'domain': domain,
        'token': account_activation_token.make_token(user),
        'uid': urlsafe_base64_encode(force_bytes(user.pk))
    })
    email = EmailMessage(
        'Conform DeepBasket account',
        template,
        settings.EMAIL_HOST_USER,
        [client_email]
    )

    email.send()


def activate(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64)
        user = User.objects.get(pk=uid)
    except (OverflowError, User.UserNotExist, ValueError, TypeError):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect('loginPage')

    if user is not None:
        user.delete()
