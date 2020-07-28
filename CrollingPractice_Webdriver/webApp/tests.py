from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
iamhuman = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'}

driver = webdriver.Chrome('C:/Users/1/Desktop/꼬딩/2020Project/CrollingPractice_Webdriver/webApp/chromedriver.exe')
url = 'https://www.google.com/'
driver.get(url)
time.sleep(1)
driver.maximize_window()
action = ActionChains(driver)
driver.find_element_by_css_selector('#gb_70').click()
time.sleep(1)
action.send_keys('ericalikelion@gmail.com').perform()
time.sleep(1)
driver.find_element_by_css_selector('.VfPpkd-RLmnJb').click()
time.sleep(2)
action.send_keys('woowoo11!@').perform()
time.sleep(1)
driver.find_element_by_css_selector('.VfPpkd-RLmnJb').click()