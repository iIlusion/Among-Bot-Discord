const Discord = require("discord.js");
const ids = require('../ids.json');
const cargob = require('../comandos/boosters/cargob');
const overlay = require('../comandos/avulsos/overlay');
const ProfileController = require('../controllers/profile-controller.js');
const JSONController = require('../../JSON/controller')

function categoria(categoriaId, roles, callback=()=>{}) {
	return { apply: (oldMember, newMember) => {
		let hasAny = false;
		let isNew = false;
		let hasCat = newMember.roles.cache.has(categoriaId)
    	roles.forEach(role => {
			if (newMember.roles.cache.has(role))
				hasAny = true;
			if (!oldMember.roles.cache.has(role) && newMember.roles.cache.has(role))
				isNew = true;
		})
		if (isNew && !hasCat) {
			newMember.roles.add(categoriaId).catch(()=>{}); // 1 - deu boost
			callback(1);
		} else if (!hasAny && hasCat) {
			newMember.roles.remove(categoriaId).catch(()=>{}); // 0 - perdeu boost
			callback(0);
		} else
			callback(-1); // -1 - nada aconteceu
	} }
}

module.exports = async (client, oldMember, newMember) => { 

	/* SERVER BOOSTER */
	const boost = categoria(ids.sepapoiador, [ids.booster], add => {
		if (add === -1) return;
		let profile = ProfileController.getProfileOfId(newMember.id);
		let canal = newMember.guild.channels.cache.get(profile.canalB)
		const boosters = JSONController.get('boosters')
		xpClaim = boosters[newMember.id].xpClaim
		lastClaim = boosters[newMember.id].lastClaim

		if (add === 1) {
      		overlay.set(newMember, 'boost.png');
      		if (!boosters[newMember.id]){
      		    boosters[newMember.id] = {}
      		    JSONController.set('boosters', boosters);
      		} 
      		
      		if (!xpClaim) {
      		    xpAtual = profile.xp
      		    nivelAtual = ProfileController.levelIfXpEquals(xpAtual);
      		    xpProxNvl = ProfileController.xpToReachLevel(nivelAtual+1);
      		    falta = xpProxNvl - xpAtual
      		    xpTotal = ProfileController.xpToReachLevel(nivelAtual+2) + 1;
      		    if ((xpProxNvl - xpAtual) <= 500) xpTotal = ProfileController.xpToReachLevel(nivelAtual+3) + 1;
      		    xpParaDar = xpTotal - xpAtual;
      		    xptotal = xpAtual+xpParaDar
      		    boosters[newMember.id].xpClaim = true
      		    JSONController.set('boosters', boosters);
      		    ProfileController.give(client, newMember, xpParaDar)
      		}
      		
      		if (!lastClaim || new Date()-lastClaim > 30*24*60*60*1000){
      		    profile.btc = profile.btc ? profile.btc + 15 : 15
      		    boosters[newMember.id].lastClaim = +new Date()
      		    JSONController.set('boosters', boosters);
      		}
		    
		}
		else if (add === 0) {
			if (canal) canal.delete().catch(()=>{})
			if (profile.canalB) { profile.canalB=undefined; ProfileController.saveProfile(newMember.id, profile); }
			if (profile.cargoB) cargob.run(client, {delete: () => {}, member: newMember, guild: newMember.guild}, ['delete'], null, null, ids, true);
			overlay.set(newMember, 'clear');
		}
		
		let guild = newMember.guild;
        const boostedUsers = guild.members.cache.filter(member => member.roles.cache.find(r => r.id===ids.booster));
		let Contadorb = guild.channels.cache.get(ids.contadorb);
		if (Contadorb) Contadorb.setName('『💜』Boosters: ' + boostedUsers.size);
	})
	boost.apply(oldMember, newMember);

	/* ANUNCIOS */
	const anuncios = categoria(ids.sepanuncios, [ids.anuncios, ids.jornal]);
	anuncios.apply(oldMember, newMember);

}