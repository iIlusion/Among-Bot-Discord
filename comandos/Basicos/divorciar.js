const ProfileController = require('../../controllers/profile-controller.js');

module.exports.run = async function (client, message, args, config, Discord, ids, bypass = false) {
    message.delete({timeout:5000})


    



        let profile = ProfileController.getProfileOfId(message.member.id);
        if (!profile.casado) return message.reply('Você não é casado, não tem como você se separar de si mesmo, infelizmente.')
        let profileparceiro = ProfileController.getProfileOfId(profile.casado);
        
        message.channel.send(`<@${message.author.id}> | Você tem certeza que deseja se divorciar?`).then(msg => {
            msg.react('✅').then(()=>{
                const time = 25000; // 25 sec
                const filter = (reaction, user) => user.id === message.author.id;

                const collector = msg.createReactionCollector(filter, { time, max: 1 });
                collector.on('collect', (reaction, user) => {
                    profileparceiro.casado = undefined;
                    ProfileController.saveProfile(profile.casado, profileparceiro);
                    profile.casado = undefined;
                    ProfileController.saveProfile(message.member.id, profile);
                    message.channel.send(`Foi um casamento e tanto em? mas tudo que é bom uma hora acaba :(`)

                    msg.delete({timeout:150}).catch(()=>{});
                });
            });
        })
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

module.exports.config = {
    name: 'divorciar',
    aliases: ["divorce"],
    staff: false,
    changelog: "Agora você poderá se divorciar caso queira terminar um relacionamento."
}