const config = require("../../config");
const { Permissions } = require('discord.js')


module.exports = {
    name: "unregister",
    aliases: ["unreg"],
    description: "Unregsiter slash commands",
    category: "admin",
    guildOnly: false,
    memberpermissions:Permissions.FLAGS.ADMINISTRATOR,
    adminPermOverride: true,
    cooldown: 2,
    usage: "",
    execute(message, args, client) {
        message.reply("Unregistering commands...");
        guild = message.guild;
        guild.commands.set([])

    },
};
