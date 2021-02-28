const MatchException = require('../../../classes/MatchException');
const ProfileController = require('../../../controllers/profile-controller.js');

const version = "4";

class MatchService {

    constructor(client) {
        this.client = client;
        this.MatchManager = client.MatchManager;
    }

    async ping(req, res, hash, v) {
        const match = await this.MatchManager.getGameByHash(hash);
        if (v!=version) {
            if (match) {
                match.updated = false;
                match.embed.setDescription('A versão do seu AutoAmong está desatualizada!\nAtualize para a versão que enviamos no canal de Moderadores de Partida.\n\n'
                + 'Sync: <autoamong://sync/'+  match.embed.voice.syncHash +'>');
                match.embed.setColor('#ff5555');
                match.embed.refresh();
            }
            return 'update';
        } else if (match && !match.updated) {
            match.updated = true;
            match.embed.reset();
        }
        if (match) return true;

        return false;
    }

    async getUsersInVoiceChannel(req, res, hash, state, code, region) {
        const match = await this.MatchManager.getGameByHash(hash);
        if (!match) return [];
        
        match.embed.update(state, code, region);

        let usersInVoiceChannel = await match.getUsersInVoiceChannel();
        let users = [];
        usersInVoiceChannel.forEach(member => {
            let profile = ProfileController.getProfileOfId(member.user.id);
            users.push({
                id: member.user.id,
                tag: member.user.username,
                nick: !profile.nick || profile.nick==="" ? "<Unlinked>" : profile.nick
            });
        });

        return users;
    }

    async setNickname(req, res, hash) {
        const match = await this.MatchManager.getGameByHash(hash);
        const userId = req.body.id;
        const nickname = req.body.nick;

        if (!match || !userId || !nickname) return;

        match.setNickname(userId, nickname);
    }

    async setGhost(req, res, hash) {
        const match = await this.MatchManager.getGameByHash(hash);
        const userId = req.body.id;
        const isGhost = req.body.mute;

        if (!userId) return;

        try {
            match.setGhost(userId, isGhost);
        } catch (e) {
            console.log(e);
        }
    }

    async startGame(req, res, hash) {
        const match = await this.MatchManager.getGameByHash(hash);
        match.startGame();
    }

    async setInGame(req, res, hash) {
        const match = await this.MatchManager.getGameByHash(hash);
        const ingame = req.body.ingame == "true";
        if (match) match.setInGame(ingame);
    }

    async endGame(req, res, hash) {
        const match = await this.MatchManager.getGameByHash(hash);
        match.endGame();
    }
}

module.exports = MatchService;