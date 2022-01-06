const db = require("../db/db_handler")
const Markup = require('node-vk-bot-api/lib/markup')
const api = require('node-vk-bot-api/lib/api')
const util = require('util')

module.exports = function (_token) {
    const api_token = _token

    const subscriber_keyboard = function (is_user_subscribed)  {
        const result = []
        is_user_subscribed
            ? result.push([Markup.button(db.get_lang("remove_subscriber_btn"), 'negative')])
            : result.push([Markup.button(db.get_lang("add_subscriber_btn"), 'positive')])
        result.push([Markup.button("Помощь", 'primary')])

        return Markup.keyboard(result).oneTime(false)
    }
    this.keyboard = function (is_user_subscribed) {
        return subscriber_keyboard(is_user_subscribed)
    }

    const send_keyboard_msg = function (ctx, text, is_user_subscribed) {
        ctx.reply(text, null, subscriber_keyboard(is_user_subscribed))
    }
    const get_user_name = function (user_id, api_response) {
        const response_user = api_response.response[0]
        return response_user.last_name && response_user.first_name
            ? response_user.first_name
            : user_id
    }

    this.add_subscriber = function (ctx) {
        const user_info = {}
        user_info.id = ctx.message.from_id;

        api('users.get', {user_ids: user_info["id"], access_token: api_token})
            .then(response => {
                user_info.username = get_user_name(user_info.id, response)
                const subscribers = db.get_vk_subscribers()

                if (subscribers[user_info.id]) {
                    send_keyboard_msg(ctx, db.get_lang("subscriber_exists", user_info.username), true)
                    return
                }

                subscribers[user_info.id] = {username: user_info.username}
                db.push("vk_subscribers", subscribers)
                send_keyboard_msg(ctx, db.get_lang("add_subscriber", user_info.username), true)
            })
            .catch(err => console.log(err))
    }

    this.remove_subscriber = function (ctx) {
        const user_info = {}
        user_info.id = ctx.message.from_id;

        api('users.get', {user_ids: user_info["id"], access_token: api_token})
            .then(response => {
                user_info.username = get_user_name(user_info.id, response)
                const subscribers = db.get_vk_subscribers()

                if (!subscribers[user_info.id]) {
                    send_keyboard_msg(ctx, db.get_lang("subscriber_absents", user_info.username), false)
                    return
                }

                delete subscribers[user_info.id]
                db.push("vk_subscribers", subscribers)
                send_keyboard_msg(ctx, db.get_lang("remove_subscriber", user_info.username), false)
            })
            .catch(err => console.log(err))
    }

    this.help = function(ctx) {
        const subscribers = db.get_vk_subscribers()
        const user_id = ctx.message.from_id;
        send_keyboard_msg(ctx, db.get_lang("hello_message", db.get("join_link")), subscribers[user_id])
    }
}