const config = require("../../config");

module.exports = {
    name: "unregister",
    aliases: ["unreg"],
    description: "Unregsiter slash commands",
    category: "admin",
    guildOnly: false,
    memberpermissions:"MANAGE_CHANNEL",
    adminPermOverride: true,
    cooldown: 2,
    usage: "",
    execute(message, args, client) {
        message.reply("Unregistering commands...");
        guild = message.guild;
        guild.commands.set([])

    },
};
