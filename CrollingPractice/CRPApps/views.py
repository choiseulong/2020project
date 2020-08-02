from django.shortcuts import render, redirect
from .models import melonList
import requests
from bs4 import BeautifulSoup

def index(request):
    obj = melonList.objects.all()
    return render(request, 'index.html', {"obj":obj})


def crolling(request):
    Melon_data_list = melonCrolling()
    melonList.objects.all().delete()
    for i in range(len(Melon_data_list)):
        melonList(
            songName=Melon_data_list[i][0],
            singerName=Melon_data_list[i][1],
            rank=int(Melon_data_list[i][2]),
            imgSrc=(Melon_data_list[i][3]),
        ).save()
    return redirect('index')

def melonCrolling():
    iamhuman = {'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'}
    url = "https://www.melon.com/chart/day/index.htm"
    
    req = requests.get(url, headers=iamhuman)
    html = req.text
    soup = BeautifulSoup(html, 'html.parser')

    song = soup.find_all('div', {"class":"ellipsis rank01"})
    songs=[]
    for s in song:
        songs.append(s.find('a').text)
    singer = soup.find_all('div', {"class":"ellipsis rank02"})
    singers=[]
    for i in singer:
        singers.append(i.find('a').text)
    rank = soup.find_all('span', {"class":"rank"})
    ranks=[]
    for j in rank[1:]:
        ranks.append(j.text)
    albumImg = soup.select('td:nth-child(4) > div > a > img')
    imgs=[]
    for p in albumImg:
        imgs.append(p.get("src"))
    sumlist = list(zip(songs, singers, ranks, imgs))
    return sumlist

    