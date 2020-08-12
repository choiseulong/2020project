from django.db import models

class charData(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=30, default="Name")
    STR = models.IntegerField(default=1)
    DEX = models.IntegerField(default=1)
    HEALTH = models.IntegerField(default=1)
    INT = models.IntegerField(default=1)
    bonusStat = models.IntegerField(default=0)
    def __str__(self):
        return self.name

""" class damageData(models.Model):
    objects = models.Manager()
    level = models.IntegerField(default=1)
    firstStat = models.IntegerField(default=0)
    secondaryStat = models.IntegerField(default=0)
    numberOfAttacks = models.IntegerField(default=1)
    total  """
