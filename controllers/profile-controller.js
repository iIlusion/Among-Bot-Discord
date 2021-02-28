const Discord = require('discord.js');
const fs = require('fs');
const ids = require('../ids.json');

class ProfileController {
    
    static getProfiles() {
        const profilesJson = fs.readFileSync(process.cwd() + '/profiles.json');
        const profiles = JSON.parse(profilesJson);
        return profiles;
    }

    static getProfileOfId(id) {
        const profiles = ProfileController.getProfiles();
        if (!profiles[id]) profiles[id] = ProfileController.createNewProfile(id);
        return profiles[id];
    }

    static createNewProfile(id) {
        const profile = {};

        profile.color = '#C71110';
        profile.xp = 0;
        profile.gold = 0;
        profile.nick = "";
        profile.sobre = "Olá, mundo!";
        profile.customAstro = "astro";
        profile.items = [];
        profile.chId = 0;
        profile.trId = 0;
        profile.ptId = 0;

        ProfileController.saveProfile(id, profile);

        return profile;
    }

    static deleteProfile(id) {
        const profiles = ProfileController.getProfiles();
        if (!profiles[id]) return;
        delete profiles[id];
        ProfileController.saveProfiles(profiles);
    }

    static saveProfile(id, profile) {
        const profiles = ProfileController.getProfiles();
        profiles[id] = profile;
        fs.writeFileSync(process.cwd() + '/profiles.json', JSON.stringify(profiles));
    }

    static saveProfiles(profiles) {
        fs.writeFileSync(process.cwd() + '/profiles.json', JSON.stringify(profiles));
    }

    static xpToReachLevel(lvl) {
        return lvl ? Math.floor(Math.pow(lvl+(4+lvl)/5 + 1, 3.2)) : 0
    }

    static levelIfXpEquals(xp) {
        return xp<34 ? 0 : Math.floor((5*(Math.pow(xp, 5/16)-1)-4)/6)
    }

    static rewardByLevel(lvl) {
        const rewardsByLevel = ids.rewardsByLevel;
        const reward = rewardsByLevel[lvl+""];
        if (lvl < 0) return undefined;
        return reward ? reward : ProfileController.rewardByLevel(lvl-1);
    }

    static lastGivenXP = {};
    static give(client, user, xp=null, gold=0) {
        const member = client.guilds.cache.get(ids.servidor).members.cache.get(user.id);
        const userId = member.id;
          
        const profile = ProfileController.getProfileOfId(userId);
        let lvlAntes = ProfileController.levelIfXpEquals(profile.xp);
            
        if (xp!==0) {
            if (this.lastGivenXP[userId] && (+new Date - this.lastGivenXP[userId] <= 2000)) return;  
            this.lastGivenXP[userId] = +new Date;
        }
        if (xp!==null) profile.xp += xp;
        else {
            const xpgive = Math.floor(Math.random() * 3 + 1);
            if (member.roles.cache.has(ids.booster)) profile.xp += xpgive*2
            else profile.xp += xpgive
        }
        if (profile.gold===undefined) profile.gold=0;
        if (0>profile.gold+gold) return false;
        profile.gold += gold;
        
        ProfileController.saveProfile(userId, profile);
          
        let lvlDepois =  ProfileController.levelIfXpEquals(profile.xp)
        if (lvlDepois > lvlAntes) { // upou
            const xpChannel = client.guilds.cache.get(ids.servidor).channels.cache.get(ids.xp);
          
            let embed = new Discord.MessageEmbed()
              .setAuthor("🥳 | LEVEL UP")
              .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
              .setColor('#38FFDD')
              .setDescription(`**Parabéns <@${member.id}> você upou do nível ${lvlAntes} para o nível ${lvlDepois}, continue interagindo para conseguir novos cargos!**`)
              .setTimestamp()
              .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');
          
            const level = ProfileController.levelIfXpEquals(profile.xp);
            const reward = ProfileController.rewardByLevel(level)
          
            if (lvlDepois%5===0){
                embed.addField("**Recompensa:**", `Você ganhou o cargo <@&${reward}>`)
                xpChannel.send(member.toString(), embed);
                member.roles.add(reward);
                if (lvlDepois===5)
                    member.roles.add(ids.sepniveis);
            } else if (level > 5) {
                xpChannel.send(member.toString(), embed);
            } else xpChannel.send(embed)
        }
        return true;
    }
}

module.exports = ProfileController;