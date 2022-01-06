const config = require("../bot_config.json")
const VkBot = require('node-vk-bot-api')
const handlerClass = require("../handlers/vk_handlers")
const db = require("../db/db_handler")


module.exports = function () {
    const token = config.vk_token
    const bot = new VkBot(token)
    const handlers = new handlerClass(token)

    bot.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            console.error(err);
        }
    });

    bot.event("Помощь", async ctx =>
        await handlers.help(ctx)
    )
    bot.event("Начать", async ctx => {
        await handlers.help(ctx)
    })

    bot.event(
        db.get_lang("add_subscriber_btn"),
        async ctx => await handlers.add_subscriber(ctx)
    )
    bot.event(
        db.get_lang("remove_subscriber_btn"),
        async ctx => await handlers.remove_subscriber(ctx)
    )

    bot.startPolling((err) => {
        if (err) {
            console.error(err.response);
        }
    });

    return bot;
}