const config = require("../../config");

var exec = require('child_process').exec;

const http = require('http');
const { Permissions } = require('discord.js')


module.exports = {
    name: "manage",
    aliases: ["user"],
    description: "Manage submission page users",
    category: "admin",
    guildOnly: false,
    memberpermissions:Permissions.FLAGS.ADMINISTRATOR,
    adminPermOverride: true,
    cooldown: 2,
    usage: "",
    execute(message, args, client) {

      // let person = client.users.fetch(args[1])
      // console.log(args[1])
      // .then(function(res) {
      //   const avatar1 = res.displayAvatarURL()
      //   const discordTag1 = res.tag
      // });

      // var avatar = avatar1
      // .replaceAll("https://", "")
      // .replaceAll("/", "-")
      // .replaceAll("\\", "-")
      // var discordTag = discordTag1
      // .replaceAll(" ", "%5Espace%5E")
      // .replaceAll("#", "%5Ehash%5E")
      // .replaceAll("<", "%5Elt%5E")
      // .replaceAll(">", "%5Egt%5E")
      // .replaceAll("&", "%5Eamp%5E")
      // .replaceAll("|", "%5Epipe%5E")
      // .replaceAll("/", "%5Eslash%5E")
      // .replaceAll("\\", "%5Ebackslash%5E")
      // .replaceAll("?", "%5Equestion%5E")
      // .replaceAll("*", "%5Estar%5E")
      // .replaceAll("\"", "%5Equote%5E")
      // .replaceAll("'", "%5Eapos%5E")
      // .replaceAll("`", "%5Ebacktick%5E")
      // .replaceAll("$", "%5Edollar%5E")
      // .replaceAll("@", "%5Eat%5E")
      // .replaceAll("!", "%5Eexclamation%5E")

      const reply = sendDetails(config.bot.token1, args[0], args[1], args[2])

      message.channel.send("Result: " + reply.toString());
        
    },
};

async function sendDetails(token, action, user, input) {
    return new Promise((resolve, reject) => {
        if(action == "create"){
          input = (input + "," + avatar + "," + username)
        }
        console.log(`http://localhost:777/api/v1/manage/token=${token}&action=${action}&user=${user}&input=${input}`)
  
        http.get(`http://localhost:777/api/v1/manage/token=${token}&action=${action}&user=${user}&input=${input}`, (resp) => {
          let data = '';
        
          resp.on('data', (chunk) => {
            data += chunk;
          });
        
          resp.on('end', () => {
            console.log(data);
            //channel.send(data.toString())
            console.log("here")
            resolve(data);
          });
        
        }).on("error", (err) => {
          console.log("Error: " + err.message);
          resolve(false);
        });
    });
  }
