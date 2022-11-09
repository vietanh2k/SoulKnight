
var GameStateManager = cc.Class.extend({
    playerA: null,
    playerB: null,
    cellWidth: null,


    ctor:function (pkg) {

        this.init();
        this.playerA = new PlayerState()
        this.readFrom(pkg)

    },
    init:function () {

        winSize = cc.director.getWinSize();







        return true;
    },

    readFrom:function (pkg){
        this.playerA.readFrom(pkg)
    }


});
