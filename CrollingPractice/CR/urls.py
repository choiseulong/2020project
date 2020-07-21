from django.contrib import admin
from django.urls import path
from CRPApps import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name="index"),
    path('melonList/', views.crolling, name="crolling"),
]
