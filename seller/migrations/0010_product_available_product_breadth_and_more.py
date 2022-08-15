# Generated by Django 4.0.5 on 2022-07-28 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seller', '0009_product'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='available',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='breadth',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='cash_on_delivery',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='delivery_by_seller',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='height',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='img_0',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='product',
            name='img_1',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='product',
            name='img_2',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='product',
            name='img_3',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='product',
            name='img_4',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='product',
            name='img_5',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='product',
            name='img_6',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='product',
            name='object_type',
            field=models.CharField(blank=True, choices=[('liquid', 'Liquid'), ('battery', 'Battery'), ('flammable', 'Flammable'), ('sensitive', 'Sensitive'), ('none', 'None')], max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='product_description',
            field=models.TextField(blank=True, max_length=3000, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='product_types',
            field=models.ManyToManyField(blank=True, null=True, to='seller.product'),
        ),
        migrations.AddField(
            model_name='product',
            name='weight',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='width',
            field=models.FloatField(blank=True, null=True),
        ),
    ]