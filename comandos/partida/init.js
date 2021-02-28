module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (!(ids.devs.includes(message.author.id) || message.member.roles.cache.has(ids.moderadorp))) return message.reply("Você não tem permissão!");

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.reply("Você precisa estar em um canal de voz.");
    if (!/^Partida \d\d$/i.test(voiceChannel.name)) return message.reply("Você só pode usar esse comando em partidas oficiais.");
    if (!voiceChannel.isSync) return message.reply("Esta sala ainda não foi sincronizada.");
    
    message.react('✅');
    message.delete({timeout: 3000});

    voiceChannel.updateOverwrite(voiceChannel.guild.roles.everyone, {'CONNECT': true}); // desbloquear canal de voz para usuarios

    if (!voiceChannel.syncEmbed) return;
    let syncEmbed = voiceChannel.syncEmbed;
    syncEmbed.unlocked = true;
    syncEmbed.setColor("50fa7b");
    syncEmbed.setDescription(`Você está jogando em uma Partida Oficial moderada por ${syncEmbed.sender}.`);
    syncEmbed.fields = [];
    syncEmbed.addFields([
        {name: 'Código', value: syncEmbed.oldCode, inline: true},
        {name: 'Região', value: syncEmbed.oldRegion, inline: true}
    ]);
    if (syncEmbed.voice && syncEmbed.voice.isSync)
        syncEmbed.voice.updateOverwrite(syncEmbed.voice.guild.roles.everyone, {'CONNECT': true});
    syncEmbed.refresh();
    await syncEmbed.message.react('📣');
    await syncEmbed.message.react('📢');
}   

module.exports.config = {
    name: 'init',
    aliases: ["iniciar"],
    staff: false,
    changelog: "!"
}