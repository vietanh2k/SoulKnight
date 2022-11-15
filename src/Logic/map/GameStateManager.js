MAX_WAVE = 25;

var GameStateManager = cc.Class.extend({
    playerA: null,
    playerB: null,
    cellWidth: null,
    _timer: null,
    canTouchNewWave:null,
    curWave:null,
    winner:null,


    ctor:function (pkg) {

        this.init();
        this.playerA = new PlayerState(1)
        this.playerB = new PlayerState(2)
        this.readFrom(pkg)
        this._timer = new Timer(this)
        this.canTouchNewWave = false
        this.curWave = 1
        this.winner = null

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
        if(this.playerA._map.monsters.length == 0 || this.playerB._map.monsters.length == 0){
            this.canTouchNewWave = true
        }
    },
    updateStateNewWave:function (){
        this.curWave += 1
        this.canTouchNewWave = false
    },
    checkWinner:function (){
        if(this.playerA.health == 0){
            if(this.playerB == 0){
                this.winner = 0
            }
            else{
                this.winner = 2
            }
            return
        }
        if(this.playerB.health == 0){
            this.winner = 1
        }
    },
    update:function (dt){
        this.playerA.update(dt)
        this.playerB.update(dt)
        this.isClearWave()
        this.checkWinner()
    }


});
