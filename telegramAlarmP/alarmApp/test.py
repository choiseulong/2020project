import telegram, requests, os
from bs4 import BeautifulSoup
from apscheduler.schedulers.blocking import BlockingScheduler
import datetime

now = datetime.datetime.now()   
bot = telegram.Bot(token='1369696078:AAGqd5jOU0wLIrF57dUGEXaTh6wiXs33YHE')
bot.sendMessage(chat_id=1299718052, text="테스트")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))