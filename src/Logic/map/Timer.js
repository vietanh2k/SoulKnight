TIME_WAVE= 25
var Timer = cc.Class.extend({
    curTime:0,
    cellWidth: null,
    _gameStateManager:null,


    ctor:function (gameManager) {
        this._gameStateManager = gameManager
        this.curTime = TIME_WAVE
        cc.log('time===' + this.curTime)
        this.init();
    },
    init:function () {

        winSize = cc.director.getWinSize();
        return true;
    },


    updateRealTime:function (dt){
        this.curTime -= dt
        if(this.curTime <0) {
            this.curTime = 0
        }
    },

    resetTime:function (time){
        this.curTime = time
    }


});
