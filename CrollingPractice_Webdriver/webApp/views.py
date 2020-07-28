from django.shortcuts import render, redirect
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
iamhuman = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'}

def index(request):
    return render(request, 'index.html')
    
def test(request):
    driver = webdriver.Chrome('webApp/chromedriver.exe')
    url = 'https://www.google.com/'
    driver.get(url)
    time.sleep(1)
    driver.maximize_window()
    action = ActionChains(driver)
    driver.find_element_by_css_selector('#gb_70').click()
    time.sleep(1)
    action.send_keys('choiseulong@gmail.com').perform()
    time.sleep(1)
    driver.find_element_by_css_selector('.VfPpkd-RLmnJb').click()
    return redirect('index')
