# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-14 00:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testtool', '0002_auto_20151210_2018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='addoperator',
            name='code',
            field=models.CharField(max_length=4, null=True),
        ),
    ]
