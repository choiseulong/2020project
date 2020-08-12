from django.contrib import admin
from django.urls import path
import damageApp.views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', damageApp.views.index, name="index"),
]
