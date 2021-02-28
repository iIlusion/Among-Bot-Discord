const ids = require('../ids.json');

function pad(num){
    num = ""+num;
    var pad = "00";
    return pad.substring(0, pad.length - num.length) + num;
}

function dhm(ms){
    years     = Math.floor(ms / (365*24*60*60*1000));
    yearsms   = ms % (365*24*60*60*1000);
    months    = Math.floor((yearsms)/(30*24*60*60*1000));
    monthsms  = ms % (30*24*60*60*1000);
    days      = Math.floor((monthsms)/(24*60*60*1000));
    daysms    = ms % (24*60*60*1000);
    hours     = Math.floor((daysms)/(60*60*1000));
    hoursms   = ms % (60*60*1000);
    minutes   = Math.floor((hoursms)/(60*1000));
    minutesms = ms % (60*1000);
    sec       = Math.floor((minutesms)/(1000));
    if (years>0)
        return years+"a " + months+"m " + days+"d " + pad(hours) + "h";
    else if (months>0)
        return months+"m " + days+"d - " + pad(hours) + "h" + pad(minutes)+"m";
    else
        return (days>0?days+"d - ":"") + pad(hours) + "h" + pad(minutes) + "m" + pad(sec)+"s";
}

function dateString(ms) {
    let now = new Date(ms);
    let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    let gmtm3 = new Date(utc.getTime() - 180 * 60000)
    return new Date(gmtm3).toLocaleString('pt-BR');
}

function roleById(guild, id) {
    return guild.roles.cache.get(id).name;
}

function tagById(guild, id) {
    return guild.members.cache.get(id).user.tag;
}

class UserLog {
    constructor(client, guild, isJoin, logsUser, member=null) {
        this.client = client;
        this.guild = guild;
        this.isJoin = isJoin;
        this.channel = client.channels.cache.get(isJoin ? ids.joinlogs : ids.modlogs);
        this.logsUser = logsUser;
        if (member)
            this.member = member;
    }
    
    cast = () => this.isJoin ? 0 : this.channel.send(this.userInfo(this.guild, this.logsUser));

    userInfo = (guild, log) => {
        const id = Object.keys(log)[0];
        let logsTxt = '';
        let member = guild.members.cache.get(id);
        if (this.member)
            member = this.member;

        log = log[id];
        const k = Object.keys(log)[0];
        const v = log[k];
        logsTxt += `[${dateString(+new Date())}] ${member ? member.user.tag : "<Não-Membro>"} (ID: ${id}) `;
        switch (k) {
            case 'j':
                logsTxt += `acabou de entrar no servidor (Tempo de discord: ${dhm(+new Date()-member.user.createdTimestamp)})${+new Date()-member.user.createdTimestamp < 7*24*60000 ? ' 🆕':''}\n`;
                break;
            case 'l':
                logsTxt += `acabou de sair do servidor (Tempo de servidor: ${dhm(+new Date()-v[0])}) (Cargos: ${v[1]})\n`
                break;
            case 'r':
                logsTxt += `foi reportado por ${tagById(guild, v[1])}\n`;
                break;
            case 'b':
                logsTxt += `foi banido por ${tagById(guild, v[1])}\n`;
                break;
            case 'k':
                logsTxt += `foi kickado por ${tagById(guild, v[1])}\n`;
                break;
            case 'm':
                logsTxt += `foi mutado por ${tagById(guild, v[1])}\n`;
                break;
            case 'bp':
                logsTxt += `foi banido de partidas por ${tagById(guild, v[1])}\n`;
                break;
            case 'w':
                logsTxt += `foi avisado por ${tagById(guild, v[1])}\n`;
                break;
            case 'ub':
                logsTxt += `foi desbanido por ${tagById(guild, v[1])}\n`;
                break;
            case 'ubp':
                logsTxt += `foi desbanido de partidas por ${tagById(guild, v[1])}\n`;
                break;
            case 'uw':
                logsTxt += `foi desavisado por ${tagById(guild, v[1])}\n`;
                break;
            case 'um':
                logsTxt += `foi desmutado por ${tagById(guild, v[1])}\n`;
                break;
            case 'eb':
                logsTxt += `teve o ban editado por ${tagById(guild, v[1])}\n`;
                break;
            case 'vj':
                logsTxt += `entrou na sala ${v[0]}\n`;
                break;
            case 'vl':
                logsTxt += `saiu da sala ${v[0]}\n`;
                break;
            case 'vc':
                logsTxt += `trocou da sala ${v[0]} para a sala ${v[1]}\n`;
                break;
        }
        
        return '```'+logsTxt+'```';
    }
}

module.exports = UserLog;