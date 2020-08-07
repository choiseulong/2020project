from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import requests
from bs4 import BeautifulSoup
options = webdriver.ChromeOptions()
# options.add_argument('headless')
options.add_argument('window-size=1920x1080')
options.add_argument('disable-gpu')
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36')
driver = webdriver.Chrome('chromedriver.exe', chrome_options=options)
url = 'https://gerinee.com/megaphone'
action = ActionChains(driver)
driver.get(url)
time.sleep(1)
driver.find_element_by_css_selector('#__layout > div > div.__wrapper-center > div.__content-content > div > div.trade-search-wrapper > div:nth-child(1) > div:nth-child(1) > button:nth-child(8)').click()
time.sleep(3)
driver.find_element_by_xpath('//*[@id="filter"]').click()
time.sleep(1)
action.send_keys('백호').key_down(Keys.TAB).key_down(Keys.ENTER).perform()
req = requests.get(url)
html = req.text
soup = BeautifulSoup(html, 'html.parser')
msg = soup.select('#__layout > div > div.__wrapper-center > div.__content-content > div > div:nth-child(6) > div:nth-child(3) > div > div.msg')
print(msg)
# msgs = []
# userName = soup.select('div > div.name')
# userNames = []
# for i in msg:
#     msgs.append(i.text.strip())
# print(msgs[0])
# for j in userName:
#     userNames.append(j.text.strip())
# for i in range(len(msgs)):
#     if "사령" in msgs[i]:
#         print(msg[i])
#         print(userNames[i])
#     else:
#         pass



#__layout > div > div.__wrapper-center > div.__content-content > div > div:nth-child(6)
#__layout > div > div.__wrapper-center > div.__content-content > div > div:nth-child(6)