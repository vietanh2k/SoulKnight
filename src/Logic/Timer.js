TIME_WAVE= 20
var Timer = cc.Class.extend({
    curTime:0,
    cellWidth: null,
    _gameStateManager:null,


    ctor:function (gameManager) {
        this._gameStateManager = gameManager
        this.curTime = TIME_WAVE
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
                // this.resetTime(TIME_WAVE)
                cc.log('touch2222222222222222222222')
            }
        }
    },

    resetTime:function (time){
        this.curTime = time
    }


});
