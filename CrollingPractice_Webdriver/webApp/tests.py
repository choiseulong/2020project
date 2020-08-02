from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import requests
from bs4 import BeautifulSoup
iamhuman = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'}

driver = webdriver.Chrome('chromedriver.exe')
url = 'http://unilion.likelion.org/'
driver.get(url)
time.sleep(1)
action = ActionChains(driver)
action.send_keys('kjkj3468@likelion.org').key_down(Keys.TAB).send_keys('woowoo11!@').perform()
driver.find_element_by_css_selector('.btn__lg--bk').click()
# url_get = driver.current_url
titleLink = []
html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')
href = soup.find_all("a", {"tabindex":"-1"})
for l in href:
    titleLink.append(l.attrs['href'])
print(titleLink)

#main > section > div > ol > li:nth-child(1) > a