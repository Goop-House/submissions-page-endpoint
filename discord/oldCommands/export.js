const config = require("../../config");

var exec = require('child_process').exec;

const http = require('http');

const {Permissions} = require('discord.js')


module.exports = {
    name: "export",
    aliases: ["exp"],
    description: "Export submissions",
    category: "admin",
    guildOnly: false,
    memberpermissions:Permissions.FLAGS.ADMINISTRATOR,
    adminPermOverride: true,
    cooldown: 2,
    usage: "",
    execute(message, args, client) {

      sendDetails(config.bot.token, args[0]).then((reply) => {

       message.channel.send("Result: " + reply.toString());
      });
    },
};

async function sendDetails(token, type) {
    return new Promise((resolve, reject) => {
        console.log(`http://10.99.0.51:777/api/v1/export/token=${token}&type=${type}`)
  
        http.get(`http://10.99.0.51:777/api/v1/export/token=${token}&type=${type}`, (resp) => {
          let data = '';
        
          resp.on('data', (chunk) => {
            data += chunk;
          });
        
          resp.on('end', () => {
            console.log(data);
            //channel.send(data.toString())
            resolve(data);
          });
        
        }).on("error", (err) => {
          console.log("Error: " + err.message);
          resolve(false);
        });
    });
  }
