from django.db import models

class test(models.Model):
    objects = models.Manager()
    title = models.CharField(max_length=100, blank=True)
    link = models.CharField(max_length=5000, blank=True)