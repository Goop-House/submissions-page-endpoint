const config = require("../../config");
const fs = require('fs');


var exec = require('child_process').exec;

const http = require('http');

const {Permissions} = require('discord.js')


module.exports = {
    name: "events",
    aliases: ["evnt"],
    description: "Manage events",
    category: "admin",
    guildOnly: false,
    memberpermissions:Permissions.FLAGS.ADMINISTRATOR,
    adminPermOverride: true,
    cooldown: 2,
    usage: "",
    execute(message, args, client) {
        var fileName = "../../events.json";
        var file = require(fileName);
        var blankEvent = ({
            name: 'Goop House Event',
            coverURL: 'https://cdn.discordapp.com/attachments/834541919568527361/874767069772660736/goop_house_logo_for_disc.png',
            startTime: '0-0-0-0-0-0',
            endTime: '0-0-0-23-59-59',
            isActive: false
        })
        if(args[0] == "create"){
            var newEvent = blankEvent;
            newEvent.name = args[1].replaceAll("-", " ")
            file.push(newEvent)
            fs.writeFileSync("events.json", JSON.stringify(file, null, 2));
            message.reply("Event created successfully")

        }
        else{
            var found = false;
            file.forEach(event => {
                if (event.name == args[1].replaceAll("-", " ")){
                    switch(args[0]) {
                        case "editName":
                            event.name = args[2].replaceAll("-", " ")
                            fs.writeFileSync("events.json", JSON.stringify(file, null, 2));
                            message.reply("Event edited successfully")
                            found = true;
                            return;

                        case "editCoverURL":
                            event.coverURL = args[2]
                            fs.writeFileSync("events.json", JSON.stringify(file, null, 2));
                            message.reply("Event edited successfully")
                            found = true;

                            return;

                        case "editStartTime":
                            event.startTime = args[2]
                            fs.writeFileSync("events.json", JSON.stringify(file, null, 2));
                            message.reply("Event edited successfully")
                            found = true;

                            return;

                        case "editEndTime":
                            event.endTime = args[2]
                            fs.writeFileSync("events.json", JSON.stringify(file, null, 2));
                            message.reply("Event edited successfully")
                            found = true;

                            return;

                        case "editIsActive":
                            event.isActive = args[2]
                            fs.writeFileSync("events.json", JSON.stringify(file, null, 2));
                            message.reply("Event edited successfully")
                            found = true;

                            return;
                        case "delete":
                            file = file.filter(item => item !== event)
                            fs.writeFileSync("events.json", JSON.stringify(file, null, 2));
                            message.reply("Event deleted successfully")
                            found = true;


                    }
                }
            });
            if(!found) {message.reply("Event or action not found")}
            
            
        }
        
    },
};

