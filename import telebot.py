import telebot
import sqlite3
import threading
from telebot import types
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
TOKEN = '8737669043:AAGQGySvxJeTu8yHTH7zYkeL3vReId9f2Ro'
ADMIN_ID = 1690462793
bot = telebot.TeleBot(TOKEN)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
def db_query(query, params=(), is_select=False):
    with sqlite3.connect('users.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        if is_select:
            return cursor.fetchall()
        conn.commit()
def init_db():
    db_query('''CREATE TABLE IF NOT EXISTS users 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                 chat_id INTEGER UNIQUE, 
                 title TEXT)''')
    db_query('''CREATE TABLE IF NOT EXISTS subjects 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                 name TEXT, teacher TEXT, cabinet TEXT)''')
    db_query('''CREATE TABLE IF NOT EXISTS schedule 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                 group_title TEXT, day_name TEXT, lesson_number INTEGER, 
                 week_type TEXT, subject_name TEXT)''')
init_db()
@app.post("/api/save-schedule")
async def save_schedule(request: Request):
    data = await request.json()
    group_title = data.get('group')
    week_type = data.get('week')
    schedule_data = data.get('schedule')
    db_query("DELETE FROM schedule WHERE group_title = ? AND week_type = ?", (group_title, week_type))
    for cell_id, subject in schedule_data.items():
        day, lesson = cell_id.split('-')
        db_query("INSERT INTO schedule (group_title, day_name, lesson_number, week_type, subject_name) VALUES (?, ?, ?, ?, ?)",
                 (group_title, day, int(lesson), week_type, subject['name']))
    target_chats = db_query("SELECT chat_id FROM users WHERE title = ?", (group_title,), is_select=True)
    for chat in target_chats:
        try:
            bot.send_message(chat[0], f"**Розклад оновлено!**\nГрупа: {group_title}\nТиждень: {week_type == 'numerator' and 'Чисельник' or 'Знаменник'}\nПерегляньте зміни на сайті.")
        except Exception as e:
            print(f"Помилка розсилки: {e}")
    return {"status": "success", "message": "Розклад збережено та розіслано"}
@app.get("/api/get-schedule")
async def get_schedule(group: str):
    rows = db_query("SELECT day_name, lesson_number, week_type, subject_name FROM schedule WHERE group_title = ?", (group,), is_select=True)
    res = {"numerator": {}, "denominator": {}}
    for row in rows:
        day, lesson, week, subject_name = row
        cell_id = f"{day}-{lesson}"
        res[week][cell_id] = {"name": subject_name, "teacher": "", "cabinet": ""}
    return res
@bot.message_handler(commands=['start'])
def start(message):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(types.KeyboardButton('Відправка повідомлення про зміну розкладу'))
    bot.send_message(message.chat.id, 'Привіт! Я бот для розсилки розкладу. Я працюю в парі з сайтом.', reply_markup=markup)

@bot.message_handler(content_types=['new_chat_members'])
def welcome_bot(message):
    if any(new_user.id == bot.get_me().id for new_user in message.new_chat_members):
        chat_id = message.chat.id
        chat_title = message.chat.title
        try:
            db_query("INSERT INTO users (chat_id, title) VALUES (?, ?)", (chat_id, chat_title))
            bot.send_message(chat_id, f"Групу '{chat_title}' зареєстровано! Тепер зміни з сайту будуть приходити сюди.")
        except sqlite3.IntegrityError:
            pass
def run_bot():
    bot.infinity_polling()

if __name__ == "__main__":
    bot_thread = threading.Thread(target=run_bot)
    bot_thread.daemon = True
    bot_thread.start()
    # Запускаємо веб-сервер для React
    # Тепер ваш React має надсилати POST запити на http://localhost:8000/api/save-schedule
    uvicorn.run(app, host="0.0.0.0", port=8000)