const fs = require('fs');
const Discord = require('discord.js')
const ids = require('../ids.json')
const ProfileController = require('../controllers/profile-controller.js'); // arrumado
/**
 * O evento guildMemberAdd é emitido após um membro entrar (ser adicionado em uma guild).
 */

module.exports = async (client, member) => {
    if (member.id === '425740197989187596') return
  const UserLog = require('../classes/UserLog');
  const ulog = {};
  ulog[member.id] = {"j": []};
  new UserLog(client, client.guilds.cache.get(ids.servidor), false, ulog).cast();
  
canal = member.guild.channels.cache.get(ids.geral)
canal.send(`<a:pink_hearts:808019508203749456> **Bem Vindo ao servidor <@${member.id}> <a:pink_hearts:808019508203749456>**
<a:CDV93:809932591867101234> **Dê uma olhada em nossas <a:setaredD:809932374158344243> <#${ids.regras}><a:CDV93:809932591867101234>**
<a:o_booster:805147026056019998> **Dê uma olhada em nossas vantagens de ser um Booster <a:setaredD:809932374158344243> <#${ids.sejabooster}> e considere dar um Boost no servidor** <a:o_booster:805147026056019998>`).then(msg=>msg.delete({timeout:30000}))

  // criar perfil no profiles.json
  ProfileController.createNewProfile(member.id);

  let penalidades = require('../penalidades.js');
  let p = await penalidades.get();
  if (p.mutes[member.id]) {
    let Guild = client.guilds.cache.get(ids.servidor);
    const role = Guild.roles.cache.find(role => role.id === ids.mutado);
    member.roles.add(role);
  }

  if (p.banidop[member.id]) {
    let Guild = client.guilds.cache.get(ids.servidor);
    const role = Guild.roles.cache.find(role => role.id === ids.banidop);
    member.roles.add(role);
  }

}