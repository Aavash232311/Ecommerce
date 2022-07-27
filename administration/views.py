from django.shortcuts import render, redirect
from django.views import View


class BasePage(View):

    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')


class ProductTree(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')

