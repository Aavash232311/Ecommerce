# Generated by Django 4.0.5 on 2022-07-19 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seller', '0006_sellerprofile_shop_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='sellerprofile',
            name='resend_torque',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='sellerprofile',
            name='torque',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
