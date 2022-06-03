require('dotenv').config()

// Util
const ora = require('ora')
const config = require('./config')
const fs = require('fs')
const express = require("express");
const bodyParser = require("body-parser");

// Slash Commands
const { Client, Collection } = require('discord.js')
const slash = require('./discord/util/slash')

// CLI
const intentsLoader = ora('Registering Intents').start()

// Checks
let finalIntents = []
if (!Array.isArray(config.bot.intents)) {
  intentsLoader.warn(
    'Intents in config file must be in an array, default intents will be used'
  )
} else {
  finalIntents = config.bot.intents
  intentsLoader.succeed('Loaded intents successfully from the config file')
}

const client = new Client({ intents: finalIntents })

// Commands
client.commands = new Collection()
client.oldCommands = new Collection()
const cooldowns = new Collection();


const events = fs
  .readdirSync('./discord/events')
  .filter(file => file.endsWith('.js'))

events.forEach(event => {
  const eventFile = require(`./discord/events/${event}`)
  if (eventFile.oneTime) {
    client.once(eventFile.event, (...args) => eventFile.run(...args))
  } else {
    client.on(eventFile.event, (...args) => eventFile.run(...args))
  }
})

const commandFiles = fs.readdirSync('./discord/oldCommands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const oldCommand = require(`./discord/oldCommands/` + file);
    client.oldCommands.set(oldCommand.name, oldCommand);
}

client.on('messageCreate', message => {
    if (!message.content.startsWith(config.bot.prefix) || message.author.bot) return;

    const args = message.content.slice(config.bot.prefix.length).split(/ +/);
    const oldCommandName = args.shift().toLowerCase();

    const oldCommand = client.oldCommands.get(oldCommandName) || client.oldCommands.find(cmd => cmd.aliases && cmd.aliases.includes(oldCommandName));

    // If command exist
    if (!oldCommand) return;

    // Check if command can be executed in DM
    if (oldCommand.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    // Check if args are required
    if (oldCommand.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (oldCommand.usage) {
            reply += `\nThe proper usage would be: \`${config.bot.prefix}${oldCommand.name} ${oldCommand.usage}\``;
        }

        return message.channel.send(reply);
    }

    // Check if user is in cooldown
    if (!cooldowns.has(oldCommand.name)) {
        cooldowns.set(oldCommand.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(oldCommand.name);
    const cooldownAmount = (oldCommand.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            // If user is in cooldown
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${oldCommand.name}\` command.`);
        }
    } else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        // Execute command
        try {
            oldCommand.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

client.login(config.bot.token)

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 
app.get("/api/v1/events", (req, res) => {
  fs.readFile( __dirname + "/" + "events.json", 'utf8', function (err, data) {
    //console.log( data );
    res.end( data );
  });
});

const port = 55555;
app.listen(port, () => {
  console.log(` and starting server on port ${port}`);
});


