from __future__ import unicode_literals

from django.db import models

# Create your models here.


class AddOperator(models.Model):
    operator = models.CharField(max_length=120)
    location = models.CharField(max_length=120, blank=False, null=True)
    code = models.CharField(max_length=4, blank=False, null=True)
    basis = models.CharField(max_length=120, blank=False, null=True)
    subbasis = models.CharField(max_length=120, blank=False, null=True)
    time = models.TimeField(max_length=5, blank=False, null=True)
    pickupId = models.IntegerField(blank=False, null=True)
    pickupLocation = models.CharField(max_length=120, blank=False, null=True)
    pickupTime = models.TimeField(max_length=5, blank=False, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __unicode__(self):
        return self.operator
