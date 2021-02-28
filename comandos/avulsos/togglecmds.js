module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    if (!args[0]) return message.reply('Uso: m!togglecmds <todos/nenhum> ou m!togglecmds <nome/alias>')
    if (args[0].toLowerCase()==='todos')
        client.disableCmds = true;
    else if (args[0].toLowerCase()==='nenhum')
        client.disableCmds = false;
    else
        if (client.disableCmds && client.disableCmds.length>0)
            if (client.disableCmds.includes(args[0]))
                client.disableCmds.splice(client.disableCmds.indexOf(args[0]), 1);
            else
                client.disableCmds.push(args[0]);
        else
            client.disableCmds = [args[0]];
    message.react('✅');
}

module.exports.config = {
    name: 'togglecmds',
	aliases: ['togglecmd'],
    staff: true,
    changelog: '!',
    bypassDisableCmds: true
}