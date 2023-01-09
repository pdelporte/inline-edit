from django.db import models

# Create your models here.

class ProductCategory(models.Model):
    # Relationships
    # Fields
    name = models.CharField(max_length=32)

class Product(models.Model):
    # Relationships
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products', default=1)
    # Fields
    name = models.CharField(max_length=255)
    webshop = models.BooleanField(default=True)
    available_from = models.DateField(null=True, blank=True)
    default_quantity = models.IntegerField(default=1)
    description = models.TextField(null=True, blank=True)

