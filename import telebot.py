import telebot
import sqlite3
from telebot import types
bot=telebot.TeleBot('8737669043:AAGQGySvxJeTu8yHTH7zYkeL3vReId9f2Ro')
def db_query(query, params=(), is_select=False):
    with sqlite3.connect('users.db') as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        if is_select:
            return cursor.fetchall()
        conn.commit()
db_query('''CREATE TABLE IF NOT EXISTS users 
            (id INTEGER PRIMARY KEY AUTOINCREMENT, 
             chat_id INTEGER UNIQUE, 
             title TEXT)''')
@bot.message_handler(commands=['start'])
def start(message):
    markup=types.ReplyKeyboardMarkup(resize_keyboard=True)
    item1=types.KeyboardButton('Сайт для змін розкладу')
    item2=types.KeyboardButton('Відправка повідомлення про зміну розкладу')
    markup.add(item1,item2)
    bot.send_message(message.chat.id,'Привіт, я бот для розсилки розкладу',reply_markup=markup) 
@bot.message_handler(content_types=['new_chat_members'])
def welcome_bot(message):
    for new_user in message.new_chat_members:
        if new_user.id == bot.get_me().id:
            chat_id = message.chat.id
            chat_title = message.chat.title
            print(f"Мене додали в нову групу! ID: {chat_id}")
            try:
                db_query("INSERT INTO users (chat_id, title) VALUES (?, ?)", (chat_id, chat_title))
                print(f"Додано групу: {chat_title} (ID: {chat_id})")
                bot.send_message(chat_id, f"Привіт! Групу '{chat_title}' зареєстровано для розсилки.")
            except sqlite3.IntegrityError:
                print(f"Група '{chat_title}' (ID: {chat_id}) вже зареєстрована.")
@bot.message_handler(content_types=['text'])
def get_user_text(message):
    if message.text=='Сайт для змін розкладу':
        bot.send_message(message.chat.id,'Ви можете відвідати наш сайт для перегляду та зміни розкладу')
        bot.send_message(message.chat.id,'https://www.example.com/schedule') # <- силка на сайт для змін розкладу
    elif message.text=='Відправка повідомлення про зміну розкладу':
        bot.send_message(message.chat.id,'Повідомлення про зміну розкладу буде надіслано')
        chats = db_query("SELECT chat_id FROM users", is_select=True)
        if not chats:
            bot.send_message(message.chat.id,'Немає зареєстрованих груп для розсилки')
            return
        for chat in chats:
            try:
                bot.send_message(chat[0], 'Увага! Розклад було змінено. Будь ласка, перевірте новий розклад на сайті.')
            except Exception as e:
                print(f"Помилка при відправці повідомлення до групи ID {chat[0]}: {e}")
    else:
        bot.send_message(message.chat.id,'Я не розумію тебе, спробуй написати щось інше')
bot.infinity_polling()