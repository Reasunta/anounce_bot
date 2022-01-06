const lang = require("./lang.json")
const db = require("./db/db_handler")
db.push("lang", lang)

const vk_bot = require("./bots/vk_bot")
const tg_bot = require("./bots/tg_bot")

const vk = vk_bot()
tg_bot(vk)
