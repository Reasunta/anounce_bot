const config = require("../bot_config.json")

const db = require("../db/db_handler")
const handlers = require("../handlers/tg_handlers")
const {Telegraf} = require('telegraf')

module.exports = function (vk_bot) {
    const vk = vk_bot
    const bot = new Telegraf(config.token) //сюда помещается токен, который дал botFather

    db.push("owner_id", config.owner_id)
    db.push("join_link", config.join_link)

    bot.start(ctx => handlers.is_private_chat(ctx) && handlers.start(ctx))

    bot.help((ctx) => ctx.reply('Send me a sticker'))

    bot.hashtag("анонс", ctx =>
        handlers.authorize(ctx) &&
        handlers.notify(ctx, ctx.message.text) &&
        handlers.notify_vk(vk, ctx.message.text)
    )
    bot.command("list", ctx => handlers.authorize(ctx) && handlers.is_private_chat(ctx) && handlers.subscriber_list(ctx))
    bot.command("export", ctx => handlers.authorize(ctx) && handlers.is_private_chat(ctx) && handlers.export(ctx))
    bot.on("callback_query", handlers.manage_subscriber)

    bot.launch()
}