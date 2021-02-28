module.exports.run = async function (client, message, args, config, Discord, ids) {
    const MatchManager = client.MatchManager;

    if (!(ids.devs.includes(message.author.id) || message.member.roles.cache.has(ids.moderadorp))) return message.reply("Você não tem permissão!");

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.reply("Você precisa estar em um canal de voz.");
    if (!/^Partida \d\d$/i.test(voiceChannel.name)) return message.reply("Você só pode usar esse comando em partidas oficiais.");

    message.delete();
    if (voiceChannel.isSync) {
        try {
            await message.member.send("O hash da sala, caso tenha perdido:```"+voiceChannel.syncHash+"```\nLink Direto: <autoamong://sync/"+voiceChannel.syncHash+">");
            return message.reply("Esta sala já está sincronizada, o codigo foi reenviado em sua DM.").then(msg=>msg.delete({timeout:5000}));
        } catch (err) {
            return message.reply("Esta sala já está sincronizada, não foi possível mandar o hash na sua DM:\n```"+voiceChannel.syncHash+"```").then(msg=>msg.delete({timeout:8000}));
        }
    }

    syncEmbed = embedSync(voiceChannel.name, message.member, Discord);
    const hash = await MatchManager.newGame(voiceChannel, message.guild.id, syncEmbed);
    voiceChannel.isSync = true;
    voiceChannel.syncEmbed = syncEmbed;
    voiceChannel.syncHash = hash;
    syncEmbed.setDescription("Clique no link abaixo para sincronizar:\n<autoamong://sync/"+hash+">\n" +
                             "\nReaja com 🔐 para desbloquear a sala. (ou m!init)" +
                             "\nReaja com 📣 para divulgar **sem** o código."+
                             "\nReaja com 📢 para divulgar **com** o código.\n");

    message.channel.send(syncEmbed).then(async msg=>{
        await msg.react('🔐');
        syncEmbed.message = msg;
        syncEmbed.voice = voiceChannel;
        collectReaction(syncEmbed);
        collectReactionDivulgar(syncEmbed, client, Discord);
    });
}

function embedSync(title, mod, Discord) {
    const syncEmbed = new Discord.MessageEmbed()
    .setColor("E0B167")
    .attachFiles([process.cwd() + '/profile/templates/astro.png'])
	.setTitle(title)
    .setAuthor(mod.user.username, mod.user.displayAvatarURL({dynamic: true}))
	.setThumbnail('attachment://astro.png')
	.setTimestamp()
    .setFooter('Among Bot', 'attachment://astro.png');
    syncEmbed.sender = mod;
    syncEmbed.refresh = () => syncEmbed.message.edit(syncEmbed);
    syncEmbed.update = (x, y, z) => update(syncEmbed, x, y, z);
    syncEmbed.oldCode = `??????`;
    syncEmbed.oldRegion = `??`;
    syncEmbed.reset = () => {
        if (syncEmbed.unlocked) {
            syncEmbed.setColor("50fa7b");
            syncEmbed.setDescription(`Você está jogando em uma Partida Oficial moderada por ${syncEmbed.sender}.`);
            syncEmbed.fields = [];
            syncEmbed.addFields([
                {name: 'Código', value: syncEmbed.oldCode, inline: true},
                {name: 'Região', value: syncEmbed.oldRegion, inline: true}
            ]);
        } else {
            syncEmbed.setColor("E0B167");
            syncEmbed.setDescription("Clique no link abaixo para sincronizar:\n<autoamong://sync/"+syncEmbed.voice.syncHash+">\n\nReaja com :closed_lock_with_key: para desbloquear a sala.");
            syncEmbed.fields = [];
        }
        syncEmbed.refresh();
    }

    return syncEmbed;
}

function collectReactionDivulgar(syncEmbed, client, Discord) {
    const time = 60*60000; // 1h
    const filter = (reaction, user) => {
        return user.id == syncEmbed.sender.id && (reaction.emoji.name=='📣' || reaction.emoji.name=='📢');
    };

    const collector = syncEmbed.message.createReactionCollector(filter, { time: time });

    collector.on('collect', (reaction, reactionCollector) => {
        if (reaction.emoji.name=='📣') 
            require('../Basicos/divulgar.js').divulgar(client, Discord, "Disponível após entrar", syncEmbed.oldRegion, syncEmbed.sender.voice.channel, true);
        else if (reaction.emoji.name=='📢') 
            require('../Basicos/divulgar.js').divulgar(client, Discord, syncEmbed.oldCode, syncEmbed.oldRegion, syncEmbed.sender.voice.channel, true);
    });
}

function collectReaction(syncEmbed) {
    const time = 7*60000; // 7 min
    const filter = (reaction, user) => {
        return reaction.emoji.name=='🔐';
    };

    const collector = syncEmbed.message.createReactionCollector(filter, { time: time, max: 1 });

    collector.on('collect', async (reaction, reactionCollector) => {
        reaction.remove(reaction.users.cache.filter(() => true));
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
    });
}

function update(syncEmbed, state, code, region) {
    refresh = false;
    if (syncEmbed.unlocked) {
        code = code.includes('\n') ? code.split('\n')[1] : code;
        refresh = syncEmbed.oldCode != code && (syncEmbed.oldCode = code);
        refresh = syncEmbed.oldRegion != region && (syncEmbed.oldRegion = region) || refresh;

        syncEmbed.fields = [];
        syncEmbed.addFields([
            {name: 'Código', value: syncEmbed.oldCode, inline: true},
            {name: 'Região', value: syncEmbed.oldRegion, inline: true}
        ]);

        if (refresh) syncEmbed.refresh();
    }
}

module.exports.config = {
    name: 'sync',
    aliases: ["sincronizar"],
    staff: false,
    changelog: "!"
}