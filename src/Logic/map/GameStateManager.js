MAX_WAVE = 25;
MAX_ENERGY = 30;
MAX_VALUE = 99999
let GameStateManagerInstance = null

var GameStateManager = cc.Class.extend({
    playerA: null,
    playerB: null,
    cellWidth: null,
    _timer: null,
    canTouchNewWave:null,
    curWave:null,
    winner:null,


    UPDATE_TYPE_NORMAL: 0,
    UPDATE_TYPE_NO_UPDATE: 1,
    UPDATE_TYPE_UPDATE_TO_FRAME_N: 2,


    ctor:function (pkg) {
        GameStateManagerInstance = this

        this.init();
        this.playerA = new PlayerState(1)
        this.playerB = new PlayerState(2)
        this.monsterFactory = new MonsterFactory()
        this.readFrom(pkg)
        this._timer = new Timer(this)
        this.canTouchNewWave = false
        this.curWave = 0
        this.winner = null
        this.isLastWave= false

        this.sumDt = 0;
        this.dt =  GAME_CONFIG.DEFAULT_DELTA_TIME
        this.frameCount = 0

        this.updateType = this.UPDATE_TYPE_NORMAL
        this.updateToFrameN = 0

        this.waveCount = 0

    },
    init:function () {

        winSize = cc.director.getWinSize();







        return true;
    },

    readFrom:function (pkg){
        var userId1 = pkg.getInt()
        cc.log('id11111111111'+userId1)
        if(userId1 == gv.gameClient._userId){
            this.playerA.readFrom(pkg)
            var userId2 = pkg.getInt()
            cc.log('id222222222222'+userId2)
            this.playerB.readFrom(pkg)
        }else{
            this.playerB.readFrom(pkg)
            var userId2 = pkg.getInt()
            cc.log('id22222222222'+userId2)
            this.playerA.readFrom(pkg)
        }
        cc.log('iddddddddd'+gv.gameClient._userId)
    },
    isClearWave:function (){
        /*if(this.playerA._map.monsters.length == 0){
            this.canTouchNewWave = true
        }*/
        if(this.playerA.isClearWave() && this.curWave < MAX_WAVE){
            this.canTouchNewWave = true
        }
    },
    updateStateNewWave:function (){
        this.curWave += 1
        this.canTouchNewWave = false
    },
    checkWinner:function (){
        if(this.curWave >= MAX_WAVE && this.playerA.isClearWave() && this.playerB.isClearWave()){
            if(this.playerA.health > this.playerB.health){
                this.winner = 1
            }else if(this.playerB.health > this.playerA.health){
                this.winner = 2
            }else{
                this.winner = 0
            }
            return;
        }

        if (!(this.playerA.health <= 0 || this.playerB.health <= 0)) {
            return
        }

        if ((this.playerA.health <= 0 && this.playerB.health <= 0) || this.playerA.health === this.playerB.health) {
            this.winner = 0
            return
        }

        if(this.playerA.health <= 0){
            this.winner = 2
            return
        }

        if(this.playerB.health <= 0){
            this.winner = 1
        }


    },

    frameUpdate: function () {
        this.playerA.update(this.dt)
        this.playerB.update(this.dt)
        this.isClearWave()
        this.checkWinner()
        this.frameCount++
    },

    update:function (ccDt){
        if (this.updateType == this.UPDATE_TYPE_NO_UPDATE) {
            return
        }

        /*if (this.updateType == this.UPDATE_TYPE_UPDATE_TO_FRAME_N) {
            let remainFrame = this.updateToFrameN - this.frameCount
            for (let i = 0; i < remainFrame; i++) {
                this.frameUpdate()
            }
            return
        }*/

        if (this.updateType == this.UPDATE_TYPE_NORMAL) {
            this.sumDt += ccDt;
            while (this.sumDt > this.dt) {
                this.frameUpdate()
                this.sumDt -= this.dt
            }
        }
    },

    getNextWaveMonstersId: function () {
        const monstersId = [];
        monstersId.push(0);
        monstersId.push(1);
        return monstersId;
    },

    activateNextWave: function (ui, monstersId) {
        for (let i = 0; i < monstersId.length; i++) {
            const m1 = this.monsterFactory.getMonster(this.playerA, monstersId[i])
            this.playerA.addMonster(m1)
            m1.visible = false
            ui.addChild(m1)

            const m2 = this.monsterFactory.getMonster(this.playerB, monstersId[i])
            this.playerB.addMonster(m2)
            m2.visible = false
            ui.addChild(m2)
        }
        if(this.curWave >= MAX_WAVE){
            this.isLastWave = true
        }
    },

    getCurWave: function () {
        return this.curWave;
    },

});
