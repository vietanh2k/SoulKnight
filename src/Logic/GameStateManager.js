MAX_WAVE = 2;
MAX_ENERGY = 30;
MAX_VALUE = 99999
let GameStateManagerInstance = null
let ActionListInstance = []
let indAction = 0
let FrameMaxForUpdate = 15

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
        ActionListInstance = []
        indAction = 0
        FrameMaxForUpdate = 15
        this.init();
        this.playerA = new PlayerState(1)
        this.playerB = new PlayerState(2)
        this.monsterFactory = new MonsterFactory()
        this.xid = 1
        this.readFrom(pkg)
        this._timer = new Timer(this)
        this.canTouchNewWave = false
        this.curWave = 0
        this.winner = null
        this.isLastWave= false
        this.dem = 0
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
        if(userId1 == gv.gameClient._userId){
            this.xid = 1
            this.playerA.readFrom(pkg)
            var userId2 = pkg.getInt()
            this.playerB.readFrom(pkg)
        }else{
            this.xid = 2
            this.playerB.readFrom(pkg)
            var userId2 = pkg.getInt()
            this.playerA.readFrom(pkg)
        }

        Random.seed(pkg.getInt())
    },
    isClearWave:function (){
        /*if(this.playerA._map.monsters.length == 0){
            this.canTouchNewWave = true
        }*/
        if(this.playerA.isClearWave() && !this.isMaxWave()){
            this.canTouchNewWave = true
        }
    },
    isMaxWave:function (){
        if(this.curWave < MAX_WAVE){
            return false;
        }
        return true;
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
            return true;
        }

        if (!(this.playerA.health <= 0 || this.playerB.health <= 0)) {
            return false;
        }

        if ((this.playerA.health <= 0 && this.playerB.health <= 0) || this.playerA.health === this.playerB.health) {
            this.winner = 0
            return true;
        }

        if(this.playerA.health <= 0){
            this.winner = 2
            return true;
        }

        if(this.playerB.health <= 0){
            this.winner = 1
            return true;
        }

        return false;
    },

    frameUpdate: function () {
        /*
        check da end game chua
         */
        this.isClearWave()
        let isEnd = this.checkWinner();
        if(isEnd){
            cc.log('KET THUC TAI FRAME = '+this.frameCount)
            return;
        }

        /*
            Nếu frame hiện tại > MaxFrame SV gửi về thì ko update
        */
        // cc.log(this.frameCount +' fam '+FrameMaxForUpdate)
        if(this.frameCount>= FrameMaxForUpdate){
            return;
        }




        /*
         Nếu frame hiện tại quá chậm so với SV thi tua nhanh
         */
        if(this.frameCount < FrameMaxForUpdate-20){
            for(var i= this.frameCount; i<FrameMaxForUpdate-5; i++){
                this.frameUpdateNormal()
                cc.log('tuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            }
        }

        this.frameUpdateNormal()


    },
    frameUpdateNormal: function () {

        this.playerA.update(this.dt)
        this.playerB.update(this.dt)
        this._timer.updateRealTime(this.dt)

        this.frameCount++


        if(indAction < ActionListInstance.length) {
            /*
            khi towi
             */
            while (indAction < ActionListInstance.length && this.frameCount >= ActionListInstance[indAction][0] ){
                cc.log('=========TRIGER++++++')
                ACTION_DESERIALIZER_FROM_ARR[ActionListInstance[indAction][1]](ActionListInstance[indAction][2]).activate(GameStateManagerInstance)
                indAction++
            }
            if(indAction >0) {
                cc.log(this.frameCount + '  ' + ActionListInstance[indAction - 1][0] + '  ' + indAction)
            }
        }
    },

    update:function (ccDt){
        // if (this.updateType == this.UPDATE_TYPE_NO_UPDATE) {
        //     return
        // }

        /*if (this.updateType == this.UPDATE_TYPE_UPDATE_TO_FRAME_N) {
            let remainFrame = this.updateToFrameN - this.frameCount
            for (let i = 0; i < remainFrame; i++) {
                this.frameUpdate()
            }
            return
        }*/

        // if (this.updateType == this.UPDATE_TYPE_NORMAL) {
            this.sumDt += ccDt;
            while (this.sumDt > this.dt) {
                this.frameUpdate()
                this.sumDt -= this.dt
            }
        // }
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
