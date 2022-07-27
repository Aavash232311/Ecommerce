from django.db import models


class ProductTrees(models.Model):
    parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.CASCADE)
    product = models.CharField(max_length=50, null=False, blank=False)
