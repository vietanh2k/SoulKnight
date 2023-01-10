
var Timer = cc.Class.extend({
    curTime:0,
    cellWidth: null,
    _gameStateManager:null,


    ctor:function (gameManager) {
        this._gameStateManager = gameManager
        this.curTime = GAME_CONFIG.TIME_WAVE
        this.checkSendNewWaveOnce = false
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
        if (this.curTime == 0 && !this.checkSendNewWaveOnce) {
            this.checkSendNewWaveOnce = true
            if(!GameStateManagerInstance.isMaxWave()) {
                testnetwork.connector.sendActions([[new NextWaveAction(this._gameStateManager.waveCount), 0]]); //this.addMonsterToBoth()
                // this.resetTime(GAME_CONFIG.TIME_WAVE)
            }
        }
    },

    resetTime:function (time){
        this.curTime = time
    }


});
