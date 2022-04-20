const { SlashCommandBuilder } = require("@discordjs/builders");

const { MessageEmbed } = require("discord.js");

var generator = require('generate-password');

var exec = require('child_process').exec;

const http = require('http');


module.exports = {
  data: new SlashCommandBuilder()

    .setName("join") // /command-name

    .setDescription("Create your Goop House Submissions page account")

    .addUserOption(option => option.setName('password').setDescription('Specify a user password (Will be generated if not specified)')),

  run: async (interaction) => {
    var userPassword = await generatePassword(interaction);
    var discordTag = await interaction.user.tag
    .replaceAll(" ", "%5Espace%5E")
    .replaceAll("#", "%5Ehash%5E")
    .replaceAll("<", "%5Elt%5E")
    .replaceAll(">", "%5Egt%5E")
    .replaceAll("&", "%5Eamp%5E")
    .replaceAll("|", "%5Epipe%5E")
    .replaceAll("/", "%5Eslash%5E")
    .replaceAll("\\", "%5Ebackslash%5E")
    .replaceAll("?", "%5Equestion%5E")
    .replaceAll("*", "%5Estar%5E")
    .replaceAll("\"", "%5Equote%5E")
    .replaceAll("'", "%5Eapos%5E")
    .replaceAll("`", "%5Ebacktick%5E")
    .replaceAll("$", "%5Edollar%5E")
    .replaceAll("@", "%5Eat%5E")
    .replaceAll("!", "%5Eexclamation%5E")
    var dicordPicture = await interaction.user.displayAvatarURL()
    .replaceAll("https://", "")
    .replaceAll("/", "-")
    .replaceAll("\\", "-")
    var detailPassword = await userPassword
    .replaceAll(" ", "%5Espace%5E")
    .replaceAll("#", "%5Ehash%5E")
    .replaceAll("<", "%5Elt%5E")
    .replaceAll(">", "%5Egt%5E")
    .replaceAll("&", "%5Eamp%5E")
    .replaceAll("|", "%5Epipe%5E")
    .replaceAll("/", "%5Eslash%5E")
    .replaceAll("\\", "%5Ebackslash%5E")
    .replaceAll("?", "%5Equestion%5E")
    .replaceAll("*", "%5Estar%5E")
    .replaceAll("\"", "%5Equote%5E")
    .replaceAll("'", "%5Eapos%5E")
    .replaceAll("`", "%5Ebacktick%5E")
    .replaceAll("$", "%5Edollar%5E")
    .replaceAll("@", "%5Eat%5E")
    .replaceAll("!", "%5Eexclamation%5E")
    console.log(interaction.user.id, detailPassword, discordTag, dicordPicture)
    var isSuccess = await sendDetails(interaction.user.id, detailPassword, discordTag, dicordPicture);
    if(isSuccess == "exists"){
      await interaction.reply({content: "It seems like you already created an account. Please make a ticket if you are having trouble accessing it.", ephemeral: true})
    }
    else if(isSuccess) {
      console.log(userPassword);
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Your Submissions Page Credentials (These have also been DMd to you)')
        .setURL('https://goop.house/')
        .addFields(
          { name: 'Username', value: interaction.user.id, inline: false },
          { name: 'Password', value: userPassword, inline: false },
        )
      ;
      await interaction.user.send({ embeds: [embed]});
      await interaction.reply({ embeds: [embed] , ephemeral: true })
    }
    else(
      await interaction.reply({content: "Failed to create your account. Please try again later. Please be aware that certain special characters will cause this error, so if you're using a custom password please try it again without special characters.", ephemeral: true})
    )
  }
};
    

function generatePassword(interaction) {
  return new Promise((resolve, reject) => {
    if(interaction.options.get('password') == null) {
      var userPassword = generator.generate({length: 12, numbers: true});
    }
    else {
      var userPassword = interaction.options.get('password').value;
    }
    resolve(userPassword);
    return;
  });
}

function sendDetails(discordID, password, discordTag, discordPicture) {
  return new Promise((resolve, reject) => {
    console.log(`http://localhost:8080/api/v1/endpoint/discordID=${discordID}&password=${password}&discordTag=${discordTag}&discordPicture=${discordPicture}`)

      http.get(`http://localhost:8080/api/v1/endpoint/discordID=${discordID}&password=${password}&discordTag=${discordTag}&discordPicture=${discordPicture}`, (resp) => {
        let data = '';
      
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        resp.on('end', () => {
          console.log(data);
          if(data.includes("already")){
            resolve("exists");
          }
          else if(data.includes('Success')) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
        resolve(false);
      });
  });
}
