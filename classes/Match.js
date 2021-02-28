const ProfileController = require('../controllers/profile-controller');
const execute = require('../botnet');
const ids = require('../ids.json');

states = {
    true: {
        true: { mute: true, deaf: true },
        false: { mute: false, deaf: false }
    },
    false: {
        true: { mute: false, deaf: false },
        false: { mute: true, deaf: false }
    }
}

getState = (alive, ingame, gamestarted) => {
    if (!gamestarted) return {deaf: false, mute: false};
    return states[ingame][alive];
}

updateMemberMute = (member, alive, ingame, gamestarted) => {
    setTimeout(()=>{
        if (!member.voice) return;

        const state = {
            deaf: member.voice.serverDeaf,
            mute: member.voice.serverMute
        }

        const newState = getState(alive, ingame, gamestarted);
        if (newState.deaf === state.deaf && newState.mute === state.mute) return;

        execute(bnClient => {
            let bnGuild = bnClient.guilds.cache.get(ids.servidor);
            if (!bnGuild) throw Error(`${bnClient.user.username} não está no servidor!`);
            let bnMember = bnGuild.members.cache.get(member.id);
            bnMember.edit(newState);
        });
    }, 200);
};

class Match {
    constructor(client, hash, voiceChannel, guildId) {
        this.client = client;
        this.matchHash = hash;
        this.voiceChannel = voiceChannel;
        this.guildId = guildId;
        this.started = false;
        this.inGame = false;
        this.alive = [];
        this.embed = null;
        this.updated = true;
    }

    getUsersInVoiceChannel = async () => {
        return this.voiceChannel.members;
    }

    setGhost = async (userId, isGhost) => {
        this.voiceChannel.members.forEach(member => {
            if (member.id != userId) return;
            if (isGhost)
                delete this.alive[member.id];
            else
                this.alive[member.id] = 1;
            updateMemberMute(member, isGhost, this.inGame, this.started);            
        });
    }

    setInGame = async (inGameStatus) => {
        if (this.started) {
            this.inGame = inGameStatus;
            this.voiceChannel.inGame = inGameStatus;
            this.voiceChannel.gameStarted = inGameStatus;
        } else {
            this.inGame = false
            this.voiceChannel.inGame = false;
            this.voiceChannel.gameStarted = false;
        }
        const sortedMembers = this.voiceChannel.members.sort((a,b)=>(this.alive[b.id]|0-this.alive[a.id]|0)*(inGameStatus?1:-1));
        sortedMembers.forEach(member => {
            updateMemberMute(member, !!+this.alive[member.id], inGameStatus, this.started);
        });
    }

    startGame = async () => {
        this.started = true;
        this.inGame = true;
        this.voiceChannel.gameStarted = true;
        this.voiceChannel.updateOverwrite(this.voiceChannel.guild.roles.everyone, {"CONNECT": false}) // lock channel
        this.voiceChannel.members.forEach(member => this.alive[member.id] = 1);
        this.setInGame(true);
    }

    endGame = async () => {
        let unlocked = this.embed.unlocked;
        this.started = false;
        this.voiceChannel.gameStarted = false;
        this.voiceChannel.updateOverwrite(this.voiceChannel.guild.roles.everyone, {"CONNECT": unlocked === null || unlocked === NaN ? true : unlocked }); // unlock channel
        this.setInGame(false);
    }

    setNickname = async (userId, newNickname) => {
        const profile = ProfileController.getProfileOfId(userId);

        profile["nick"] = newNickname;
        ProfileController.saveProfile(userId, profile);
    }
}

module.exports = Match;