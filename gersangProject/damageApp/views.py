from django.shortcuts import render, redirect
from .models import charData
def index(request):
    char = charData.objects.all()
    return render(request, 'index.html', {"char_key": char})

def damage(request):
    return redirect('index')