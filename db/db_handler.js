const JSONdb = require("simple-json-db")
const util = require('util');

const result = function (db_path) {
    this.db = new JSONdb(db_path)

    this.get = function (key) {
        const keys = key.split(".")
        let result = this.db.get(keys.shift())

        while(keys.length > 0) {
            if (typeof result == "undefined") break;
            result = result[keys.shift()]
        }
        return result
    }

    this.push = function(table, value) {
        this.db.set(table, value)
    }

    this.get_lang = function (lang_key, ...values) {
        const template = this.get("lang." + lang_key)
        return template && util.format(template, ...values)
    }

    this.get_subscribers = function() {
        return this.get("subscribers") || {}
    }

    this.get_vk_subscribers = function() {
        return this.get("vk_subscribers") || {}
    }
}

module.exports = new result("./db/prod.json")