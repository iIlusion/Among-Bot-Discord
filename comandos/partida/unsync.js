module.exports.run = async function (client, message, args, config, Discord, ids) {
    const MatchManager = client.MatchManager;

    if (!(ids.devs.includes(message.author.id) || message.member.roles.cache.has(ids.moderadorp))) return message.reply("Você não tem permissão!");

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.reply("Você precisa estar em um canal de voz.");
    if (!/^Partida \d\d$/i.test(voiceChannel.name)) return message.reply("Você só pode usar esse comando em partidas oficiais.");
    if (!voiceChannel.isSync) return message.reply("Esta sala não esta sincronizada.");
    
    
    voiceChannel.isSync = false;
    MatchManager.removeGame(voiceChannel.syncHash);
    message.reply(`Sala dessicronizada.`).then(msg=>{msg.delete({timeout:5000})});
    message.delete();

    voiceChannel.updateOverwrite(voiceChannel.guild.roles.everyone, {'CONNECT': false});
}   

module.exports.config = {
    name: 'unsync',
    aliases: ["dessincronizar"],
    staff: false,
    changelog: "!"
}