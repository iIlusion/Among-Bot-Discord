const Discord = require('discord.js');
const AmongSprite = require('amongsprite');
const JSONController = require('../JSON/controller.js');

const completeList = JSONController.get('items');
async function getAttachment(profile, callback) {
    let bg, hat, outfit, pet;
    for (let realItem of completeList) 
        if (profile.bgId===realItem[0])
            bg = realItem[4];
        else if (profile.chId===realItem[0])
            hat = realItem[4];
        else if (profile.trId===realItem[0])
            outfit = realItem[4];
        else if (profile.ptId===realItem[0])
            pet = realItem[4];

    bg = bg ? bg : 'OUTERSPACE';
    let badges = profile.badge ? profile.badge.split(',') : undefined;
    badges = badges ? badges.map(badge => process.cwd()+'/profile/templates/' + badge) : undefined;
    const canvas = 
        badges ? await AmongSprite.create(600, profile.color, bg, hat, outfit, pet, ...badges)
               : await AmongSprite.create(600, profile.color, bg, hat, outfit, pet, undefined);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'user.png');
    callback(attachment);
}

module.exports = getAttachment;