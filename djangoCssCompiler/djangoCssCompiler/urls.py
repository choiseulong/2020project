from django.contrib import admin
from django.urls import path
import compilerApp.views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', compilerApp.views.index, name="index"),
]
