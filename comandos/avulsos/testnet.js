const execute = require('../../botnet');

module.exports.run = async function (originalClient, message, args, config, Discord) {
    const repeat = parseInt(args[0] || 1);

    for (let x = 1; x <= repeat; x++)
        execute(client => {
            const channel = client.channels.cache.get(message.channel.id);
            channel.send('test ' + x);
        });
}

module.exports.config = {
    name: 'testnet',
    aliases: [],
    changelog: '!',
    staff: true
}