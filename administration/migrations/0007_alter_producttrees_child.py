# Generated by Django 4.0.5 on 2022-07-11 12:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0006_alter_producttrees_child'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producttrees',
            name='child',
            field=models.ManyToManyField(blank=True, null=True, related_name='children', to='administration.producttrees'),
        ),
    ]
