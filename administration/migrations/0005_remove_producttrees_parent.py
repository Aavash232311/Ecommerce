# Generated by Django 4.0.5 on 2022-07-11 12:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0004_alter_producttrees_parent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='producttrees',
            name='parent',
        ),
    ]
