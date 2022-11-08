
var GameStateManager = cc.Class.extend({
    playerA: null,
    playerB: null,
    cellWidth: null,
    _gameStateManager:null,


    ctor:function () {

        this.init();
        this.playerA = new PlayerState()


    },
    init:function () {

        winSize = cc.director.getWinSize();







        return true;
    },


});
