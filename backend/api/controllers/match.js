const matchService = require('../services/match');
const format = require('../utils/formatResponse');

class MatchController {
    constructor(client) {
        this.client = client;
        this.MatchService = new matchService(client);
    }
    
    ping = async (req, res, next) => {
        try {
            const response = await this.MatchService.ping(req, res, req.query.hash, req.query.v);

            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    getUsersInVoiceChannel = async (req, res, next) => {
        try {
            const response = await this.MatchService.getUsersInVoiceChannel(req, res, req.query.hash, req.query.state, req.query.code, req.query.region);
            res.status(200).send(format(response));
        } catch (e) {
            next(e);
        }
    }

    setNickname = async (req, res, next) => {
        try {
            const response = await this.MatchService.setNickname(req, res, req.body.hash);

            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    setGhost = async (req, res, next) => {
        try {
            const response = await this.MatchService.setGhost(req, res, req.body.hash);

            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    startGame = async (req, res, next) => {
        try {
            const response = await this.MatchService.startGame(req, res, req.body.hash);

            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    setInGame = async (req, res, next) => {
        try {
            const response = await this.MatchService.setInGame(req, res, req.body.hash);

            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    endGame = async (req, res, next) => {
        try {
            const response = await this.MatchService.endGame(req, res, req.body.hash);

            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = MatchController;