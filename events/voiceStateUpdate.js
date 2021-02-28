const { Message } = require("discord.js");
const ids = require("../ids.json");
const JSONController = require("../JSON/controller");

module.exports = async (client, oldState, newState) => {
    const membersInVoiceChannel = ""
    const oldChannel = oldState.channel, newChannel = newState.channel;
    const MatchManager = client.MatchManager;
    const user = (oldState||newState).member;

    joinLogs(client, user, oldChannel, newChannel);
    if(!newChannel) user.streak = 0; // Saiu da call zera streak (xp por tempo, em: ./index.js)
    else {
        const canaisvip = JSONController.get('canaisvip');
        if (canaisvip[newChannel.id]) {
            canaisvip[newChannel.id].timestamp = +new Date();
            JSONController.set('canaisvip', canaisvip);
        }
    }

     if (newChannel != oldChannel) { // mudou de canal
        let newCName, oldCName;
        if (newChannel) newCName = newChannel.name.toLowerCase().replace(' ', '-');
        if (oldChannel) oldCName = oldChannel.name.toLowerCase().replace(' ', '-');
        
        // Desmutar qnd entrar em outra sala:
        if (newChannel && newChannel.type == 'voice' && (newCName.includes('partida') ||  newCName.includes('minigame') || newCName.includes('nave'))) {
            if (!newState.member.roles.cache.find(r => r.id === ids.mutado))
                if (newState.member.voice.serverMute)
                    newState.member.voice.setMute(!!newChannel.gameStarted);
            if (newState.member.voice.serverDeaf)
                newState.member.voice.setDeaf(false);
        }

        // Iterar canais de voz
        newState.guild.channels.cache.forEach(async c => {
            let curName = undefined;
            if (c) curName = c.name.toLowerCase().replace(' ', '-');
            let rgx1 = /partida-\d+/g, rgx2 = /partida-\d+/g;

            // Canal = Partida Oficial
            if (rgx1.exec(curName)) {
                const saiu = newChannel == null || !rgx2.exec(newCName);
                const entrou = curName == newCName;
                const isModerator = isModP(user);
                const modTrocouSala = isModerator && oldChannel && oldCName === curName && !saiu && /partida-\d+/g.exec(oldCName);
                const modSaiu = isModerator && saiu;

                if (modTrocouSala) {
                    if (c.type != 'voice')
                        clearChatFromChannel(curName, c, oldChannel);
                    else
                        await lockVoiceChannel(MatchManager, c);
                }
                
                if (modSaiu) {
                    clearUserPermsFromChannel(user, c);
                    if (oldChannel && curName === oldCName && /partida-\d+/g.exec(oldCName)) {
                        if (c.type != 'voice')
                            return clearChatFromChannel(curName, c, oldChannel);
                        await lockVoiceChannel(MatchManager, c);
                    }

                } else if (saiu) {
                    clearUserPermsFromChannel(user, c);

                } else if (entrou) {
                    c.updateOverwrite(user.id, {READ_MESSAGE: true, VIEW_CHANNEL: true, SEND_MESSAGES: true }) 

                } else { // entrou (porém, aqui: c = outros canais de voz)
                    //c.updateOverwrite(user.id, {'VIEW_CHANNEL': false});
                }
            }
        })
    }
}

joinLogs = (client, member, oldC, newC) => {
    const UserLog = require('../classes/UserLog');
    const ulog = {};
    
    if (oldC != newC) {
        if (oldC && newC)
            ulog[member.id] = {"vc": [oldC.name, newC.name]};
        else if (newC)
            ulog[member.id] = {"vj": [newC.name]};
        else if (oldC)
            ulog[member.id] = {"vl": [oldC.name]};
            
        new UserLog(client, client.guilds.cache.get(ids.servidor), true, ulog).cast();
    }
}

isModP = user => {
    return user.roles.cache.has(ids.moderadorp);
}

countModP = c => {
    let hasMod = 0;
    c.members.forEach(member => hasMod += isModP(member));
    return hasMod;
}

clearUserPermsFromChannel = (user, c) => {
    if (c.permissionOverwrites.get(user.id))
        c.permissionOverwrites.get(user.id).delete().catch(err => console.log(err));
}

clearChatFromChannel = (chatName, c, voiceChannel) => {
    const cCat  = c.parent;
    const cPerm = c.permissionOverwrites;
    const cName = chatName;
    setTimeout(async ()=>{
        if (countModP(voiceChannel)>0) return;
        if (!c.isDeleting) {
            c.isDeleting = true;
            c.guild.channels.create(cName, {type: 'text'}).then(async (channel) => {
                await channel.setParent(cCat);
                await channel.updateOverwrite(c.guild.roles.everyone.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
                await c.delete();
            })
        }
    }, 1800); // (1.8s para evitar copiar perms antes de todos sairem do voice channel)
}

lockVoiceChannel = async (MatchManager, c) => {
    if (countModP(c)>0) return;

    try {
        const gameInVoiceChannel = await MatchManager.getGameByVoiceChannelId(c.id);
        if (gameInVoiceChannel) await gameInVoiceChannel.endGame(); 
    } catch (Exception) {}
    if (c.isSync) { // unsync
        c.isSync = false;
        MatchManager.removeGame(c.syncHash);
    }

    c.members.forEach(member => member.voice.kick());    
    c.updateOverwrite(c.guild.roles.everyone, {'CONNECT': false});  // Bloquear canal de voz para usuarios
    c.updateOverwrite(ids.moderadorp, {'CONNECT': true}); // Liberar canal de voz pra org
}