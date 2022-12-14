# Generated by Django 4.0.5 on 2022-09-29 02:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seller', '0012_product_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='discount',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='discount_valid',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='object_type',
            field=models.CharField(blank=True, choices=[('Liquid', 'Liquid'), ('Battery', 'Battery'), ('Flammable', 'Flammable'), ('Sensitive', 'Sensitive'), ('None', 'None')], max_length=50, null=True),
        ),
    ]
