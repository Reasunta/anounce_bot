const util = require('util')

const config = require("./bot_config.json")
const db = require("./db/db_handler")

const lang = require(util.format("./lang/%s.json", config.lang))
db.push("lang", lang)

const vk_bot = require("./bots/vk_bot")
const tg_bot = require("./bots/tg_bot")

tg_bot(vk_bot())
