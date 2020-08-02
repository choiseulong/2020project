from django.contrib import admin
from django.urls import path
import webApp.views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', webApp.views.index, name="index"),
]
