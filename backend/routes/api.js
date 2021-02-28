const router = require('express').Router();
const MatchController = require('../api/controllers/match');
const AuthMiddleware = require('../api/middlewares/auth');
const ValidateParamsMiddleware = require('../api/middlewares/params');

/* Middlewares */
const _AuthMiddleware = new AuthMiddleware();
const _ValidateParamsMiddleware = new ValidateParamsMiddleware();

module.exports = client => { 
    const _MatchController = new MatchController(client);

    /*
    * (passa o hash pra ver se nn ta invalido, retorna bool)
    */
    router.get('/ping', _AuthMiddleware.run, _ValidateParamsMiddleware.run, _MatchController.ping);

    /*
    * (lista com nome do discord, id, e IGN [q vamo faze no m!profiles dps] de todo mundo na mesma call do mod com o ID que passar)
    */
    router.get('/usersInVoiceChannel', _AuthMiddleware.run, _ValidateParamsMiddleware.run, _MatchController.getUsersInVoiceChannel);

    /*
    * (passa o id e o novo IGN do usuario p definir - esse vai se pro mod na hora de linkar as contas do among cm o discord no app)
    */
    router.put('/nickname', _AuthMiddleware.run, _ValidateParamsMiddleware.run, _MatchController.setNickname);

    /*
    * (passa o id de quem deve ser mutado na call: morto/ejetado)
    */
    router.put('/ghost', _AuthMiddleware.run, _ValidateParamsMiddleware.run, _MatchController.setGhost);

    /*
    * (quem entrar na call depois de ter startado o game vai ser considerado um ghost)
    */
    router.post('/startgame', _AuthMiddleware.run, _ValidateParamsMiddleware.run, _MatchController.startGame);

    /*
    * (passa booleana, [true - no jogo: todo mundo da call deve ficar mutado], [false - votação/fim do jogo: td mundo desmutado menos os ghost)
    */
    router.post('/ingame', _AuthMiddleware.run, _ValidateParamsMiddleware.run, _MatchController.setInGame);

    /*
    * (limpa os ghost e desmuta td mundo, cabo o game)
    */
    router.post('/endgame', _AuthMiddleware.run, _ValidateParamsMiddleware.run, _MatchController.endGame);

    /*  TO-DO /!\
    *   Force Mute (str id + bool mute) (mutar e desmutar usuario)
    */
   // router.put('/forcemute', _AuthMiddleware.run, _ValidateParamsMiddleware.run, _MatchController.forceMute)

    return router;
}