const Match = require('./Match');
const MatchUtils = require('./MatchUtils');

class MatchManager {

    constructor(client) {
        this.client = client;

        this.matches = [];
    }

    getGameByHash = async (hash) => {

        const game = this.matches.filter(g => g.matchHash == hash);

        if (game[0]) return game[0];

        return null;
    }

    getGameByVoiceChannelId = async (voiceChannelId) => {
        const game = this.matches.filter(g => g.voiceChannel.id == voiceChannelId);

        if (game[0]) return game[0];

        return null;
    }

    newGame = async (voiceChannel, guildId, embed=null) => {
        const hash = MatchUtils.generateMatchHash();
        
        const match = new Match(this.client, hash, voiceChannel, guildId);
        if (embed) match.embed = embed;
        this.matches.push(match);

        return hash;
    }

    removeGame = async (hash) => {
        for (let i = 0; i < this.matches.length; i++) {
            const match = this.matches[i];

            if (match.matchHash != hash) continue;

            if (match.embed) match.embed.message.delete();
            this.matches.splice(i, 1);

            return true
        }
        return false;
    }
}

module.exports = MatchManager;