# Generated by Django 4.0.5 on 2022-07-10 17:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0003_alter_producttrees_child_alter_producttrees_parent_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producttrees',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='m', to='administration.producttrees'),
        ),
    ]