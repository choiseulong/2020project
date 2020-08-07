from django.shortcuts import render, redirect
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import requests
from bs4 import BeautifulSoup
from .models import test

def index(request):
    obj = test.objects.all()
    return render(request, 'index.html', {"list":obj})

def save_DB(request):
    test.objects.all().delete()
    DB_List = collect_DB()
    for i in range(len(DB_List)):
        test(
            title=DB_List[i][0],
            link=DB_List[i][1]
        ).save()
    print("success")
    return redirect('index')

def collect_DB():
    options = webdriver.ChromeOptions()
    # options.add_argument('headless')
    options.add_argument('window-size=1920x1080')
    options.add_argument('disable-gpu')
    options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36')
    driver = webdriver.Chrome('webApp/chromedriver.exe', chrome_options=options)
    url = 'http://unilion.likelion.org/'
    driver.get(url)
    time.sleep(1)
    action = ActionChains(driver)
    action.send_keys('kjkj3468@likelion.org').key_down(Keys.TAB).send_keys('woowoo11!@').perform()
    driver.find_element_by_css_selector('.btn__lg--bk').click()
    # url_get = driver.current_url
    titleList = []
    titleLink = []
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    title = soup.select('a > div > h4')
    for i in title :
        titleList.append(i.text.strip())
    time.sleep(1)
    href = soup.find_all("a", {"tabindex":"-1"})
    for l in href:
        titleLink.append(l.attrs['href'])
    sumlist = list(zip(titleList, titleLink))
    return sumlist



# 참고 :http://blog.naver.com/PostView.nhn?blogId=kiddwannabe&logNo=221188260422&parentCategoryNo=&categoryNo=&viewDate=&isShowPopularPosts=false&from=postView 