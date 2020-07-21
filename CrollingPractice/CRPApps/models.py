from django.db import models

class melonList(models.Model):
    objects = models.Manager()
    songName = models.CharField(max_length=100)
    singerName = models.CharField(max_length=100)
    rank = models.IntegerField(default=0)
    imgSrc = models.TextField(blank=True)
    