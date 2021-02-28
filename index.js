const Discord = require('discord.js');
const { readdirSync, lstatSync } = require("fs"); 
const JSONController = require('./JSON/controller');
const Enmap = require('enmap');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
require('dotenv').config();
const id = require("./ids.json");

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


const ProfileController = require('./controllers/profile-controller.js');
const MatchManager = require('./classes/MatchManager');

//const profiles = ProfileController.getProfiles();

//for (const id in profiles) {
//    if (!profiles[id].level) profiles[id].level = 1;
//    if (!profiles[id].xp) profiles[id].xp = 0;
//    if (!profiles[id].sobre) profiles[id].sobre = 'Olá, mundo!';
//    if (!profiles[id].color) profiles[id].color = '#C71110';
//
//    console.log(`${id} perfil arrumado`);
//}

//ProfileController.saveProfiles(profiles);

function removeItem(array, item) {
    const index = array.indexOf(item);
    if (index > -1)
        array.splice(index, 1);
}

let changelog = JSONController.get('changelog');
let keys = Object.keys(changelog);
const changes = {add: [], mod: [], rem: []};
const incomplete = {};
async function loadCommands(path, r=null) {
    const files = await readdirSync(path);
    return new Promise((resolve, reject) => {
        files.forEach(async file => {
            const pathStat = await lstatSync(`${path}/${file}`);
            if (pathStat.isFile()) {
                console.log(`[LOG COMANDOS] Carregado o comando - [${file}]`);
                const command = require(`./${path}/${file}`);
                const cmdName = command.config.name;
                if (command.config.staff===undefined) incomplete[cmdName] ? incomplete[cmdName].push('staff') : incomplete[cmdName]=['staff'];
                if (command.config.canal===undefined) incomplete[cmdName] ? incomplete[cmdName].push('canal') : incomplete[cmdName]=['canal'];
                if (command.config.changelog===undefined) incomplete[cmdName] ? incomplete[cmdName].push('changelog') : incomplete[cmdName]=['changelog'];
                let cmdLog = command.config.changelog;
                    cmdLog = cmdLog ? cmdLog : '';
                client.commands.set(cmdName, command);
                command.config.aliases.forEach(a => {
                    client.aliases.set(a, cmdName)
                    removeItem(keys, cmdName);
                    const str = "Comando `m!" + cmdName + '`'
                              + (cmdLog ? " - " + cmdLog:'');
                    if (changelog[cmdName] !== undefined && changelog[cmdName] != cmdLog) {
                        if (cmdLog!=="!") changes.mod.push(str);
                    } else if (changelog[cmdName] === undefined) {
                        if (cmdLog!=="!") changes.add.push(str);
                    }

                    changelog[cmdName] = cmdLog ? cmdLog : '';
                });
            } else if (pathStat.isDirectory()) {
                const fileStat = await lstatSync(`${path}/${file}`);
                if (fileStat.isDirectory())
                    return await loadCommands(`${path}/${file}`, resolve)
                else if (fileStat.isFile()) {
                    const command = require(`./${path}/${file}`)
                    const cmdName = command.config.name;
                    let cmdLog = command.config.changelog;
                        cmdLog = cmdLog ? cmdLog : '';
                    client.commands.set(cmdName, command);
                    console.log(`[LOG COMANDOS] Carregado o comando - [${file}]`)
                    command.config.aliases.forEach(a => {
                        client.aliases.set(a, cmdName);
                        removeItem(keys, cmdName);
                        const str = "Comando `m!" + cmdName + '`'
                                  + (cmdLog ? " - " + cmdLog:'');
                        if (changelog[cmdName] !== undefined && changelog[cmdName] != cmdLog){
                            if (cmdLog!=="!") changes.mod.push(str);
                        } else if (changelog[cmdName] === undefined) {
                            if (cmdLog!=="!") changes.add.push(str);
                        }

                        changelog[cmdName] = cmdLog ? cmdLog : '';
                    });
                }
            }
        })
        if (r) r();
    });
}

/* Changelog */
(async () => {
    removeItem(keys, 'sistema');
    loadCommands('./comandos').then(() => {
        keys.forEach(cmdName => {
            changes.rem.push("Comando `m!"+cmdName+"`");
            delete changelog[cmdName];
        });

        const sistema = JSONController.get('sistema');
        sistema.force_add.forEach(x=>changes.add.push(x));
        sistema.force_mod.forEach(x=>changes.mod.push(x));
        sistema.force_rem.forEach(x=>changes.rem.push(x));
        sistema.force_add = []; sistema.force_mod = []; sistema.force_rem = [];
        
        systemKeys = Object.keys(sistema);
        removeItem(systemKeys, '__aviso'); 
        removeItem(systemKeys, 'force_add'); 
        removeItem(systemKeys, 'force_mod'); 
        removeItem(systemKeys, 'force_rem'); 

        Object.keys(changelog.sistema).forEach(k => {
            v = changelog.sistema[k];
            if (sistema[k] === undefined){ 
                changes.rem.push(k + " - " + v);
                delete changelog.sistema[k];
            } else if (sistema[k] != v) {
                changes.mod.push(k + " - " + v);
                changelog.sistema[k] = sistema[k];
            }
            
            removeItem(systemKeys, k);
        });
        
        systemKeys.forEach(k => {
            changes.add.push(k + " - " + sistema[k])
            changelog.sistema[k] = sistema[k];
        });

        JSONController.set('changelog', changelog);
        JSONController.set('sistema', sistema);

        changelogStr = "";                   // alterar emojis no ready.js
        if (changes.add.length) changelogStr += "\n%emoji1% **Adicionados:**\n" + changes.add.map(add=>" • "+add+"\n").join('')
        if (changes.mod.length) changelogStr += "\n%emoji2% **Modificados:**\n" + changes.mod.map(mod=>" • "+mod+"\n").join('')
        if (changes.rem.length) changelogStr += "\n%emoji3% **Removidos:**\n" + changes.rem.map(rem=>" • "+rem+"\n").join('')
        client.changelog = changelogStr;
        if (Object.keys(incomplete)) {
            console.log('Faltando propriedades nos comandos:');
            console.log(Object.keys(incomplete).map(k=>`${k}: ${incomplete[k].map(v=>`\n • ${v}`)}`).join('\n'));
        }
    });
})();

const evtFiles = readdirSync('./events/')
evtFiles.forEach(async f => {
  const eventName = f.split('.')[0]
  const event = require(`./events/${f}`)

  client.on(eventName, event.bind(null, client))
  console.log('[LOG EVENTOS]', `Carregando o evento - [${f}]`)
})

client.login(process.env.TOKEN) /* Inicia o Bot. */

// Verificações (mute/ban/banp)
const penalidades = require('./penalidades.js');
let loopCount = 1;

async function loop() {
    loopCount++;
    let p = await penalidades.get();

    // Mute
    for (mutedID in p.mutes) {
        if (p.mutes[mutedID]<+new Date()) {
            const user = client.guilds.cache.get(id.servidor).members.cache.get(mutedID);
            if (user) {
                delete p.mutes[mutedID];

                user.roles.remove(id.mutado);
                if (!user.roles.cache.has(id.banidop))
                    user.roles.remove(id.seppunicao).catch(()=>{});
            }
        }
    }

    // Ban Partida
    for (banpID in p.banidop) {
        if (p.banidop[banpID]<+new Date()) {
            const user = client.guilds.cache.get(id.servidor).members.cache.get(banpID);
            if (user) {
                delete p.banidop[banpID];

                user.roles.remove(id.banidop);
                if (!user.roles.cache.has(id.mutado))
                    user.roles.remove(id.seppunicao).catch(()=>{});
            }
        }
    }

    // Ban
    for (bannedId in p.bans) {
        const banInfo = p.bans[bannedId];

        if (banInfo['expires-in'] == 'never') continue;

        if (banInfo['expires-in'] >= +new Date()) continue;

        const guildId = banInfo['banned-in'];
        const guild = client.guilds.cache.get(guildId);

        if (!guild) continue;

        // usuário cumpriu o tempo de ban e está na lista de bans
        try {
            await guild.members.unban(bannedId);
        } catch (err) { // usuário não está banido no servidor
            delete p.bans[bannedId];
            continue;
        };

        console.log(`[LOG] Usuário de ID ${bannedId} foi desbanido.`);
    }

    // Save
    await penalidades.set(p);

    // Sorteio
    const sorteios = JSONController.get('sorteios');
    for (let idx in sorteios)
        if (+new Date>sorteios[idx].timestamp) {
            require('./comandos/moderacao/sorteio.js').pick(
                client,
                sorteios[idx].channelId,
                sorteios[idx].msgId,
                sorteios[idx].level,
                sorteios[idx].qnt,
                sorteios[idx].premio
            );
            delete sorteios[idx];
        }
    JSONController.set('sorteios', sorteios.filter(el => el!=null));

    // Sugestão
    const sugestoes = JSONController.get('sugestoes');
    for (let idx in sugestoes)
        if (+new Date>sugestoes[idx].timestamp) {
            require('./comandos/Basicos/sugerir.js').pick(
                client,
                sugestoes[idx].channelId,
                sugestoes[idx].msgId,
            );
            delete sugestoes[idx];
        }
    JSONController.set('sugestoes', sugestoes.filter(el => el!=null));

    // Avisar ao dono e ao cargo depois de 2 dias e excluir após 7 dias
        let catvip = client.guilds.cache.get(id.servidor).channels.cache.find(c => c.id === id.catvip && c.type == "category")
        let vipchannels = catvip.children.sort().filter(c => c.type == "voice");
        let canaisvip = JSONController.get('canaisvip');
    

    for (let channel of vipchannels) {
        channel = channel[1];
        const dono = canaisvip[channel.id].dono
        const user = client.guilds.cache.get(id.servidor).members.cache.get(dono);
        if (canaisvip[channel.id])
            if (canaisvip[channel.id].warn===undefined && +new Date() > canaisvip[channel.id].timestamp + 2*24*60*60*1000) { // 2 dias 
                canaisvip[channel.id].warn = 1;
                user.send(`**Olá <@${dono}>!\nEu sou o robô de verificações do Among Us OOC e verifiquei aqui em meu sistema que seu Canal Vip \`(${channel.name})\` não foi utilizado por mais de \`2 dias\`, caso chegue em 7 dias, seu canal será excluído e você não será reembolsado das BoostCoins gastas. (Seu cargo não será excluído caso isso aconteça)**`);
            } else if (canaisvip[channel.id].warn===1 && +new Date() > canaisvip[channel.id].timestamp + 5*24*60*60*1000) { // 5 dias 
                canaisvip[channel.id].warn = 2;
                user.send(`**Olá <@${dono}>!\nEu sou o robô de verificações do Among Us OOC e verifiquei aqui em meu sistema que seu Canal Vip \`(${channel.name})\` não foi utilizado por mais de \`5 dias\`, caso chegue em 7 dias, seu canal será excluído e você não será reembolsado das BoostCoins gastas. (Seu cargo não será excluído caso isso aconteça)**`);
            } else if (canaisvip[channel.id].warn===2 && +new Date() > canaisvip[channel.id].timestamp + 6*24*60*60*1000) { // 6 dias 
                canaisvip[channel.id].warn = 3;
                user.send(`**Olá <@${dono}>!\nEu sou o robô de verificações do Among Us OOC e verifiquei aqui em meu sistema que seu Canal Vip \`(${channel.name})\` não foi utilizado por mais de \`6 dias\`, caso chegue em 7 dias, seu canal será excluído e você não será reembolsado das BoostCoins gastas. (Seu cargo não será excluído caso isso aconteça)**`);
            } else if (canaisvip[channel.id].warn===3 && +new Date() > canaisvip[channel.id].timestamp + 7*24*60*60*1000) { // 7 dias
                user.send(`**Olá <@${dono}>!\nVenho notificar que seu Canal Vip \`(${channel.name})\` não foi utilizado por mais de \`7 dias\`, logo, foi excluido.**`);
                delete canaisvip[channel.id];
                channel.delete()
            }
    }
    JSONController.set('canaisvip', canaisvip);
        

    // Xp em call
    const minuto = 12;
    const channels = client.guilds.cache.get(id.servidor).channels.cache.filter(c => c.type === 'voice');
    for (const [channelID, channel] of channels)
        for (const [memberID, member] of channel.members) {  
            if (member.voice && !member.voice.channel.name.includes('úsica'))   
                member.muteStreak = member.voice && member.voice.mute ? (member.muteStreak ? member.muteStreak+1 : 1) : 0;
            member.streak = member.streak ? member.streak + 1 : 1;
            const isTripulante = !!member.roles.cache.find(role => role.id === id.tripulante);
            const cName = member.voice && member.voice.channel ? member.voice.channel.name.toLowerCase() : null;
            if (!cName) continue;
            const cType = cName.includes('nave')||cName.includes('minigame') 
                        ? 'nave' 
                        : (cName.includes('partida') ? 'oficial' : 'call');
            if (member.streak > 1 && member.muteStreak < 2*minuto
                && member.voice && member.voice.channel.members && member.voice.channel.members.size>=1) { // tripulante 2 minutos desmutado e qntEmCall >= 4    
                if (cType=='nave' && member.streak % (2*minuto) == 0) // 2xp cada 2min
                    ProfileController.give(client, member, 2, 1);

                else if (cType=='oficial' && member.streak % (minuto/2) == 0) // 3xp cada 30s
                    ProfileController.give(client, member, 3, 1);

                else if (cType=='call' && member.streak % (5*minuto) == 0) // 2xp cada 5min
                    ProfileController.give(client, member, 2);
            }
        }
}
setInterval(loop, 5000);

/* Ligando web server */

client.MatchManager = new MatchManager(client);

require('./backend/')(client);