const config = require('../config.json');
const ids = require('../ids.json');

const JSONController = require('../JSON/controller');

module.exports = async (client, reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;
    let cargos = JSONController.get('cargos');
    let role;
    cargos.forEach(async reactCargo => {
        if (reaction.message.id === reactCargo.msgId && reaction.emoji.id === reactCargo.emoji) {
            if (!role || role.id!==reactCargo.cargo)
                role = await reaction.message.guild.roles.fetch(reactCargo.cargo);
            let member = reaction.message.guild.members.cache.get(user.id);
            if (!member) try {
                    member = reaction.message.guild.members.fetch(user.id).then(m=>m.roles.add(role).catch(()=>{})).catch(()=>{});
                } catch (err) {}
            else
                member.roles.add(role).catch(()=>{})
        }
    })
}