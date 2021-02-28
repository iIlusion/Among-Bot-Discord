const Discord = require('discord.js');
const tokens = require('./bots.json');

let clients = [];
for (token of tokens) {
    let client = new Discord.Client();
    client.login(token);
    clients.push(client);
}

module.exports = clients;