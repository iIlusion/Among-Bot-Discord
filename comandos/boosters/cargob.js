const ProfileController = require('../../controllers/profile-controller.js');
const JSONController = require('../../JSON/controller')

module.exports.run = async function (client, message, args, config, Discord, ids) {
    message.delete({timeout:5000})

    if (!(ids.devs.includes(message.author.id) || message.member.roles.cache.has(ids.booster))) return message.reply("Você não tem permissão para criar um cargo!");
    
    var catvipRole = message.guild.roles.cache.find(role => role.id === ids.cargocatvip);
    // modelo do comando m!cargob Reset/Delete/Clean - Remove o cargo juntamente com a sala
    let arg0 = (args[0]+"").toLowerCase();
    if (arg0==='reset'||arg0==='delete'||arg0==='clean') {
        let profile = ProfileController.getProfileOfId(message.member.id);
        let role = message.guild.roles.cache.find(role => role.id === profile.cargoB);
        let canal = message.guild.channels.cache.get(profile.canalB)
        const cargosvip = JSONController.get('cargosvip')
        const canaisvip = JSONController.get('canaisvip')
        if (cargosvip[profile.cargoB].dono != message.member.id) return // terminar de bloquear aqui donos secundarios
        if (canal) {
            canal.delete();
            delete canaisvip[profile.canalB]
            JSONController.set('canaisvip', canaisvip);
            
        }
        if (role) {                
            var [withRole, withRoleRemCat] = checkIfRemoveCatFromAllWhenDelete(message, profile.cargoB)
            if (withRole)
                withRole.forEach(member => member.roles.remove(profile.cargoB)); 
            if (withRoleRemCat)
                withRoleRemCat.forEach(member => member.roles.remove(catvipRole)); 
            
            const ps = ProfileController.getProfiles();
            for (let p2idx in ps) {
            let p2 = ps[p2idx];
            if (p2.cargoB === profile.cargoB) {
                p2.cargoB = undefined;
                ProfileController.saveProfile(p2idx, p2);
            }}
            
            delete cargosvip[profile.cargoB]
            JSONController.set('cargosvip', cargosvip);
            profile.cargoB = undefined;
            ProfileController.saveProfile(message.member.id, profile);


            role.delete().then(()=>
                message.react('✅')
            ).catch(console.error);
        }
        else 
            return message.react('❌').then(() => {
                message.reply("Você não tem nenhum cargo para excluir, crie um utilizando m!cargob <nome> <#cor>").then(msg => msg.delete({timeout:5000}));
            });
        return;
    }
    
    if (arg0==='dardono'||arg0==='setdono') {
        let profile = ProfileController.getProfileOfId(message.member.id);
        let role = message.guild.roles.cache.find(role => role.id === profile.cargoB);
        if (!role) return message.reply('Você ainda não criou um cargo vip! Use: `m!cargob <nome> <#cor>`').then(msg=>msg.delete({timeout:8000}));
        let dononv = message.mentions.members.first();
        if (!dononv) return message.reply('Formato incorreto! Uso: `m!cargob dardono <@membro>`').then(msg=>msg.delete({timeout:8000}));
        if (!dononv.roles.cache.has(profile.cargoB)) return message.reply("Essa pessoa não possui acesso ao seu cargo, portanto não pode ser adicionada como dono")
        let profiledono = ProfileController.getProfileOfId(dononv.id);
        if (profiledono.cargoB) return message.reply("Essa pessoa já é dona de um cargo, ela não pode ser dona de mais de um cargo ao mesmo tempo.")
        const ps = ProfileController.getProfiles();
        let qnt = 0;
        for (let p2idx in ps) {
        let p2 = ps[p2idx];
        if (p2.cargoB === profile.cargoB)
            qnt++;
        }
        if (qnt >= 3) return message.reply("Já existem 3 donos para esse cargo, você não pode adicionar mais")
        
        message.channel.send(`<@${dononv.id}> | o <@${message.author.id}> está lhe concedendo a permissão de ser dono do cargo <@&${profile.cargoB}>, você deseja aceitar?`).then(msg => {
            msg.react('✅').then(()=>{
                const time = 25000; // 25 sec
                const filter = (reaction, user) => user.id === dononv.id;
                
                const collector = msg.createReactionCollector(filter, { time, max: 1});
                collector.on('collect', (reaction, user) => {
                    
                    
                    if (profile.canalB) {
                     profiledono.canalB = profile.canalB
                     let canal = message.guild.channels.cache.get(profile.canalB)
                     canal.updateOverwrite(dononv, {
                    'SEND_MESSAGES': true,
                    'MUTE_MEMBERS': true,
                    'PRIORITY_SPEAKER': true,
                    'DEAFEN_MEMBERS': true,
                    });
                    }
                    profiledono.cargoB = profile.cargoB
                    ProfileController.saveProfile(dononv.id, profiledono);
                    msg.delete({timeout:150}).catch(()=>{});
                })
            })
        })
        return;
    }

    if (arg0==='setar'||arg0==='dar'||arg0==='add') {
        let profile = ProfileController.getProfileOfId(message.member.id);
        let role = message.guild.roles.cache.find(role => role.id === profile.cargoB);
        if (!role) return message.reply('Você ainda não criou um cargo vip! Use: `m!cargob <nome> <#cor>`').then(msg=>msg.delete({timeout:8000}));
        let amigo = message.mentions.members.first();
        if (!amigo) return message.reply('Formato incorreto! Uso: `m!cargob dar <@membro>`').then(msg=>msg.delete({timeout:8000}));
        
        message.channel.send(`<@${amigo.id}> | <@${message.author.id}> **está lhe concedendo o cargo vip \`${role.name}\`, deseja aceitar?**`).then(msg => {
            msg.react('✅').then(()=>{
                const time = 25000; // 25 sec
                const filter = (reaction, user) => user.id === amigo.id;

                const collector = msg.createReactionCollector(filter, { time, max: 1 });
                collector.on('collect', (reaction, user) => {
                    amigo.roles.add(role);
                    let hasCat = amigo.roles.cache.has(catvipRole)
                    if (!hasCat) amigo.roles.add(catvipRole)

                    msg.delete({timeout:150}).catch(()=>{});
                });
            });
        })
        return;
    }
    if (arg0==='remover'||arg0==='unset') {
        let profile = ProfileController.getProfileOfId(message.member.id);
        let role = message.guild.roles.cache.find(role => role.id === profile.cargoB);
        if (!role) return message.reply('Você ainda não criou um cargo. Use: `m!cargob <nome> <#cor>`').then(msg=>msg.delete({timeout:8000}))
        let amigo = message.mentions.members.first()
        if (!amigo) return message.reply('Formato incorreto! Uso: `m!cargob remover <@membro>`').then(msg=>msg.delete({timeout:8000}))
        if (!amigo.roles.cache.has(role.id)) return message.reply('Este usuário não tem um cargo vip seu.').then(msg=>msg.delete({timeout:8000}))
        let profileamg = ProfileController.getProfileOfId(amigo.id);
        if (profile.cargoB === profileamg.cargoB) return message.channel.send("Você não pode remover esse usuario do seu cargo pois ele também é um dono.")

        amigo.roles.remove(role).catch(()=>{})

        message.react('✅')

        if (alreadyFriend(amigo, role.id)) return;

        let hasCat = amigo.roles.cache.has(catvipRole)
        if (!hasCat) amigo.roles.remove(catvipRole)
        return;
    }

    // modelo do comando m!cargob Nome Cor - Cria um cargo novo com o nome que você definir e a cor, caso ja exista, apenas edita o existente
    let match = /^(.+) (#?[\da-f]{1,6})$/i.exec(args.join(' '));
    if (!match) return message.reply('Formato: `m!cargob <nome> <#corhex>`').then(msg => msg.delete({timeout:5000}));

    let nome = match[1]
    if (nome.length > 30) return message.reply("O nome do cargo não pode ter mais que 30 letras").then(msg => msg.delete({timeout:5000}));
    let cor = match[2];

    let banContains = /«|»|dono|moderadora?|coord/i;
    let banExact = ['STAFF', 'ADMIN', 'ADMINISTRADOR', 'MAKER', 'MOD', 'MODS', 'MOD\'S', 'ADM','EJETADO', 'FANTASMA', 'TRIPULANTE', 'IMPOSTOR', 'SHERLOCK HOLMES', 'ADMINISTRADORES', 'ADMINS', 'MODERADORES', 'ADMS', 'STAFFS', 'DJ'];

    if (banContains.test(nome) || nome.split(' ').filter(word=>banExact.includes(word.toUpperCase())).length>0) {
        message.react('❌');
        return message.reply('Você não pode utilizar um cargo com esse nome!').then(msg => msg.delete({timeout:5000}));
    }

    let profile = ProfileController.getProfileOfId(message.member.id);
    if (profile.cargoB) {
        let role = message.guild.roles.cache.find(role => role.id === profile.cargoB);
        if (!role) {
            profile.cargoB = undefined;
            ProfileController.saveProfile(message.member.id, profile);
            return module.exports.run(client, message, args, config, Discord, ids);
        }

        role.edit({
            name: nome,
            color: cor
        })
        .then()
        .catch(console.error)
        message.react('✅');
    } else {
        message.guild.roles.create({
            data: {
              name: nome,
              color: cor,
              position: catvipRole.position+1
            },
        })
        .then(role => {
            const cargosvip = JSONController.get('cargosvip')
            cargosvip[role.id] = {"dono":message.member.id}
            JSONController.set('cargosvip', cargosvip);
            profile.cargoB = role.id;
            ProfileController.saveProfile(message.member.id, profile);
            message.member.roles.add(role);
            message.member.roles.add(catvipRole);
            message.react('✅');
        })
        .catch(console.error);
    }
}   

function collectReaction(message, id, cb) {
    const time = 60000; // 1 min
    const filter = (reaction, user) => {
        return user.id===id;
    };

    const collector = message.createReactionCollector(filter, { time: time, max: 1 });

    collector.on('collect', async (reaction, reactionCollector) => {
        cb();
    });
}

function alreadyFriend(member, but=null) {
    let profiles = ProfileController.getProfiles();
    for (let pId in profiles) {
        let p = profiles[pId];
        if (p.cargoB && member.roles.cache.has(p.cargoB) && but!==p.cargoB)
            return true;
    }
    return false;
}

function checkIfRemoveCatFromAllWhenDelete(message, roleid) {
    let withRole = message.guild.members.cache.filter(member => 
        member.roles.cache.find(role => role.id == roleid)
    );
    let withRoleRemCat = withRole.filter(member => !alreadyFriend(member, roleid));
    return [withRole, withRoleRemCat];
}

module.exports.config = {
    name: 'cargobooster',
    aliases: ["cargob"],
    staff: false,
    changelog: "Comando criado para os boosters gerenciarem seus cargos."
}