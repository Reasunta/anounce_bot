# Anounce bot
## Описание
Это бот, предназначенный для рассылки желающим в ЛС Telegram и ВКонтакте определенным образом помеченных сообщений из тг-чата.

## Стек
* node.js 13.14.0
* [telegraf](https://telegraf.js.org/) - для кодинга бота ТГ
* [node-vk-bot-api](https://www.npmjs.com/package/node-vk-bot-api) - для кодинга бота ВК
* [simple-json-db](https://www.npmjs.com/package/simple-json-db) - для хранения данных

## Подготовка к запуску
### Telegram
* Создать тг-бот и получить его токен - [инструкция тут](https://sendpulse.com/ru/knowledge-base/chatbot/create-telegram-chatbot)
* Создать тг-чат, добавить туда бота, сделать его админом, сгененировать ссылку на присоединение к чату
### VKontakte
* Создать группу ВК, можно закрытую
  * Настройки -> Работа с API -> Ключи доступа - сгенерировать API-ключ с доступом к сообщениям сообщества
  * Настройки -> Работа с API -> Long Poll API - включить на последнюю версию и подключить типы событий, связанные с сообщениями
  * Настройки -> Сообщения - включить сообщения сообщества, включить возможности ботов в сообщениях, разрешить добавление бота в беседы
* Проверить, что Long Polling работает - можно тестовым запросом [здесь](https://dev.vk.com/method/groups.getLongPollServer), используя токен, созданный выше, и id группы - ответ метода должен быть успешным и содержать ссылку на сервер
### Bot
* Клонировать репозиторий
* Заполнить конфиг бота. Свой id для owner_id можно узнать [тут](https://okeygeek.ru/id-v-telegram-chto-ehto-kak-uznat)
* выполнить `npm install`
* выполнить `node main.js`

## Как пользоваться
* При открытии диалога с ботом через ВК или ТГ тот выведет приветственное сообщение и предложит подписаться на себя через клавиатуру в диалоге либо перейти в чат по ссылке
* то же окно будет выводиться при отправке команды /start
* Подписчик будет получать копии сообщений из чата, отправленные владельцем бота и помеченные тегом #анонс
* В ЛС подписчику доступна кнопка, по которой можно отписаться от этой рассылки

Админ имеет дополнительные функции:
* посмотреть список подписчиков в ВК и ТГ - команда /list
* Запросить экспорт данных из БД по подписчикам для бэкапа - команда /export

## Архитектура бота
* **bots** - модули с ботами для ТГ и ВК соответственно
* **db** - модуль для работы с хранилищем данных + сюда же кладутся сами json-файлы с данными
* **handlers** - обработчики событий ботов ТГ и ВК соответственно
* **lang** - место для своих словарей, которыми может общаться бот
* *bot_config.json* - основной конфиг бота
* *main.js* - точка входа в приложение

### Структура config-файла
* token - токен для работы с Telegram API,
* vk_token - токен для работы в VK API
* owner_id - id пользователя Telegram, который будет считаться владельцем бота и иметь доступ к админским командам
* join_link - ссылка на чат ТГ, которая будет пробрасываться в сообщения от бота
* lang - имя json-файла в папке lang, из которого будет подтянут словарь бота

## TODO
* команда help
* докер файл
