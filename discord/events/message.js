// Util
const ora = require("ora");
const config = require("../../config");
const fs = require("fs");
const { Discord, Collection } = require('discord.js')




module.exports = {
  event: "messageCreate", // Name of the event
  oneTime: false, // If set to true the event will only be fired once until the client is restarted
  run: async (message) => {

  },
};
