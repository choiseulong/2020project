import telegram, requests, os
from bs4 import BeautifulSoup
from apscheduler.schedulers.blocking import BlockingScheduler
import datetime
now = datetime.datetime.now()   
bot = telegram.Bot(token='1369696078:AAGqd5jOU0wLIrF57dUGEXaTh6wiXs33YHE')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def telegram_bot():
    url = 'https://algumon.com/'
    req = requests.get(url)
    req.encoding='utf-8'
    html = req.text
    soup = BeautifulSoup(html, 'html.parser')

    name = soup.select('div.post-group > div.product-body.clearfix > div > p:nth-child(2) > span > a')
    latest = name[0].text.strip()
    latest_link = "https://algumon.com"+str(name[0].attrs['href'])
    with open(os.path.join(BASE_DIR, 'latest.txt'), 'r+', encoding="utf-8") as f_read :
        before = f_read.readline()
        if before != latest :
            bot.sendMessage(chat_id=1299718052, text="새롭게 추가된 항목\n"+latest+"\n"+latest_link+"\n"+str(now.strftime('%H:%M:%S')))
        else :
            bot.sendMessage(chat_id=1299718052, text="새롭게 추가된 항목이 없습니다\n"+str(now.strftime('%H:%M:%S')))
        f_read.close()
    with open(os.path.join(BASE_DIR, 'latest.txt'), 'r+', encoding="utf-8") as f_write :
        f_write.write(latest)
        f_write.close()

sched = BlockingScheduler()
telegram_bot()
sched.add_job(telegram_bot, 'interval', seconds=10)
sched.start()