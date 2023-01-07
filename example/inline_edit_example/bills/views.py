from django.shortcuts import render

from .models import *
# Create your views here.

def index(request):
    object = Product.objects.get(pk=1)
    return render(request, 'bills/index.html', locals())