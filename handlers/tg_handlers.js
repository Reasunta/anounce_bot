const db = require("../db/db_handler")

module.exports = new function () {
    const subscriber_keyboard = function (is_user_subscribed) {
        const buttons = []
        is_user_subscribed
            ? buttons.push([{"text": db.get_lang("remove_subscriber_btn"), "callback_data": "/remove_me"}])
            : buttons.push([{"text": db.get_lang("add_subscriber_btn"), "callback_data": "/add_me"}])
        return {
            reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: true,
                inline_keyboard: buttons

            }
        }
    }

    const edit_inline_keyboard_message = function (ctx, text, is_user_described) {
        ctx.telegram.editMessageText(
            ctx.update.callback_query.message.chat.id,
            ctx.update.callback_query.message.message_id,
            undefined,
            text,
            subscriber_keyboard(is_user_described)
        ).then().catch(err => err)
    }

    const add_subscriber = function (ctx) {
        const subscribers = db.get_subscribers()
        const user_info = ctx.update.callback_query.from

        if (subscribers[user_info.id]) {
            edit_inline_keyboard_message(ctx, db.get_lang("subscriber_exists", user_info.username), true)
            return
        }

        subscribers[user_info.id] = {username: user_info.username}
        db.push("subscribers", subscribers)

        edit_inline_keyboard_message(ctx, db.get_lang("add_subscriber", user_info.username), true)
    }

    const remove_subscriber = function (ctx) {
        const subscribers = db.get_subscribers()
        const user_info = ctx.update.callback_query.from

        if (!subscribers[user_info.id]) {
            edit_inline_keyboard_message(ctx, db.get_lang("subscriber_absents", user_info.username), false)
            return
        }

        delete subscribers[user_info.id]
        db.push("subscribers", subscribers)
        edit_inline_keyboard_message(ctx, db.get_lang("remove_subscriber", user_info.username), false)
    }

    this.is_private_chat = function (ctx) {
        const result = ctx.message.chat.type === "private";
        if (!result) ctx.reply(db.get_lang("incorrect_chat_type"))
        return result
    }

    this.subscriber_list = function (ctx) {
        const subscribers = db.get_subscribers()
        const vk_subscribers = db.get_vk_subscribers()

        const result = Object.values(subscribers)
            .map(item => `@${item.username}`)
            .reduce(
                (previous, current) => previous + "\n" + current,
                db.get_lang("subscriber_list_header")
            )

        const vk_result = Object.entries(vk_subscribers)
            .map(entry => `https://vk.com/id${entry[0]} - ${entry[1].username}`)
            .reduce(
                (previous, current) => previous + "\n" + current,
                db.get_lang("subscriber_vk_list_header")
            )


        ctx.reply(`${result}\n\n${vk_result}`)
    }

    this.notify = function (ctx, message) {
        const subscribers = db.get_subscribers()
        const result_message = message + "\n\n"
            + db.get_lang("join_group_message", db.get("join_link"))

        Object.keys(subscribers).forEach(id =>
            ctx.telegram.sendMessage(id, result_message)
        )
        return true
    }

    this.notify_vk = function (vk_bot, message) {
        const subscribers = db.get_vk_subscribers()
        const result_message = message + "\n\n"
            + db.get_lang("join_group_message", db.get("join_link"))

        vk_bot.sendMessage(Object.keys(subscribers).map(item => parseInt(item)), result_message)
    }

    this.authorize = function (ctx) {
        const result = db.get("owner_id") === ctx.message.from.id
        if (!result) ctx.reply(db.get_lang("access_denied"))
        return result;
    }

    this.manage_subscriber = function (ctx) {
        const data = ctx.update.callback_query.data;
        data === "/add_me" && add_subscriber(ctx)
        data === "/remove_me" && remove_subscriber(ctx)
    }

    this.start = function (ctx) {
        const subscribers = db.get_subscribers()
        const user_info = ctx.update.message.from
        ctx.reply(
            db.get_lang("hello_message", db.get("join_link")),
            subscriber_keyboard(subscribers[user_info.id]))
    }

    this.export = function(ctx) {
        const subscribers = db.get_subscribers()
        const vk_subscribers = db.get_vk_subscribers()
        ctx.reply('"subscribers": ' + JSON.stringify(subscribers))
        ctx.reply('"vk_subscribers": ' + JSON.stringify(vk_subscribers))
    }
}