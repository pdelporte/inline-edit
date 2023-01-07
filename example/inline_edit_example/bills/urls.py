from django.contrib import admin
from django.urls import path

from . import views, views_api
from lib.utils import upd_data

# app_name = 'bills'
urlpatterns = [
    path('', views.index, name='index'),
    #
    path("update/data/", upd_data, name="update_data" ),
    #
    path('product/unit/api', views_api.ProductCategoryList.as_view(), name='api-product-category-list'),
]
