var Melee2 = Enemy.extend({
    _map: null,
    direction: null,
    radius: 0,
    speed: 300,
    posLogic: null,

    ctor: function(posLogic, map) {
        this._super(res.celll, posLogic, map);
        this.rangeAtk = 9;
        this.timeDelayAtk = 2;          //thoi gian delay moi lan atk (s)
        this.timeDelayAtkMax = 3.5;
        this.timeBreak = 0;         //thoi gian nghi sau khi atk
        this.timeBreakMax = 0.6;

        this.timeDelayStartAtk = 0.5;         //thoi gian nghi sau khi atk
        this.timeDelayStartAtkMax = 0.5;

        this.we = new Knife(posLogic, map);
        this.we.setAnchorPoint(0.5, 0.3)
        this.we.setPosition(this.width/2, this.height/4)

        this.addChild(this.we)
        this.setCascadeColorEnabled(false);
    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.enemy10, '10idle_%01d.png', 0, 3, duration)
        const moveDownAnimId2 = this.load(res.enemy10, '10run_%01d.png', 0, 3, duration)

        this.play(0)
    },

    getDirMoveByType: function () {

        if(this.isChangeDir) {
            this.isChangeDir = false;
            var dir = cc.pSub(this.posLogic, BackgroundLayerInstance.player.posLogic);
            let disRan = Math.floor(Math.random() * GAME_CONFIG.CELLSIZE*2) + GAME_CONFIG.CELLSIZE*1;
            this.disMove = disRan;
            let angleTotal = 300;
            //check nhin thay char
            if(this.isChangeDirByBlock){
                this.checkCol += 3;
                this.isChangeDirByBlock = false;
                dir = new cc.p(-this.dirMove.x, -this.dirMove.y);
                this.disMove = GAME_CONFIG.CELLSIZE*3;
                // var diff = cc.pSub(dir,temp)         // Tính vector chênh lệch giữa hai vector
                // var diffNormalized = cc.pNormalize(diff) // Lấy vector đơn vị của vector chênh lệch
                // var projectionLength = cc.pDot(temp, diffNormalized) // Tính độ dài vector phân giác
                // var projection = cc.pMult(diffNormalized, projectionLength) // Tính vector phân giác và lưu kết quả vào biến projection
                // dir = cc.pAdd(temp, projection);
                angleTotal=180;
                if(this.checkCol >=6){
                    angleTotal = 360;
                    this.checkCol -= 2;
                }
            }else if(!this.isInRange || this.numBullet > 0){
                var dir = cc.pSub(BackgroundLayerInstance.player.posLogic, this.posLogic);
                let disRan = Math.floor(Math.random() * GAME_CONFIG.CELLSIZE*2) + GAME_CONFIG.CELLSIZE*1;
                this.disMove = disRan;
                angleTotal = 150;
            }

            let angle = Math.floor(Math.random() * angleTotal) - angleTotal / 2;
            let radians = angle * Math.PI / 180;
            let cos = Math.cos(radians);
            let sin = Math.sin(radians);
            let newX = dir.x * cos - dir.y * sin;
            let newY = dir.x * sin + dir.y * cos;
            let dirBullet = new cc.p(newX, newY);

            this.dirMove = cc.pNormalize(dirBullet);
        }
    },

    logicUpdate: function (dt) {
        if(this.isDestroy) return;
        if(BackgroundLayerInstance.state === GAME_CONFIG.STATE_ONSTART){
            return;
        }

        if(this.timeDelayAtk > 0){
            this.timeDelayAtk -= dt;
        }

        if(this.timeBreak > 0){
            this.timeBreak -= dt;
        }

        if(!this.isCanDo) return;

        if(this.timeDelayStartAtk > 0){
            this.timeDelayStartAtk -= dt;
            if(this.timeDelayStartAtk <= 0){
                this.dirMain = cc.pNormalize(cc.pSub(BackgroundLayerInstance.player.posLogic, this.posLogic));
                this.activeAtk(this.dirMain);
            }
        }

        if(this.timeBreak > 0){
            return;
        }

        //attack neu trong range
        let player = BackgroundLayerInstance.player;
        let disWithChar = cc.pDistance(this.posLogic, player.posLogic);
        if(disWithChar <= GAME_CONFIG.CELLSIZE*this.rangeAtk ){
            this.isInRange = true;
            // this.dirMain = cc.pNormalize(cc.pSub(BackgroundLayerInstance.player.posLogic, this.posLogic));
            if(this.timeDelayAtk <= 0 && disWithChar <= GAME_CONFIG.CELLSIZE*4) {
                this.timeDelayAtk = Math.random()*3 + this.timeDelayAtkMax;
                this.timeDelayStartAtk = this.timeDelayStartAtkMax;
                // this.activeAtk(this.dirMain);

                //tele player pos
                let pos = new cc.p(player.posLogic.x, player.posLogic.y);
                let tmpPos = null;
                for(var i=0; i<3; i++){
                    let x1 = Math.random()*2-1;
                    let y1 = Math.random()*2-1;
                    let tmp = cc.pNormalize(cc.p(x1,y1));
                    let pos2 = cc.pAdd(pos, cc.pMult(tmp, GAME_CONFIG.CELLSIZE/2));
                    if(!this.checkColision(pos2)) {
                        tmpPos = pos2;
                        break;
                    }
                }
                if(tmpPos != null){
                    this.posLogic = tmpPos;
                }else{
                    this.posLogic = pos;
                }

                this.timeBreak = this.timeBreakMax;
                return;
            }
        }else{
            this.isInRange = false;
            this.dirMain = this.dirMove;
        }
        if(this.we != null){
            this.we.updatePosLogic(this.posLogic)
            this.we.updateDir(this.dirMain);
        }



        this.isCanSee = this.isCanSeeChar();
        if(this.isCanSee){
            this.isStop = false;
        }
        // if(this.isCanSeeChar()){
        //     cc.log("can see")
        // }
        if(!this.isStop) {
            this.checkCol--;
            if (this.checkCol <= 0) this.checkCol = 0;
            this.getDirMoveByType()

            this.updateMove(this.dirMove, dt)
        }

        if(this.isStop){
            this.timeStop -= dt;
            if(this.timeStop <=0){
                this.isStop = false;
            }
        }

    },

    activeAtk: function (dir) {
        this.aniRun(dir)
        this.we.updatePosLogic(this.posLogic)
        this.we.updateDir(dir);
        this.we.activateWeapon(2);
    },

    checkColision: function (newPos) {
        var l = Math.floor((newPos.x - this.radius)/60);
        var r = Math.floor((newPos.x + this.radius)/60);

        var u = Math.floor((newPos.y + this.radius)/60);
        var d = Math.floor((newPos.y - this.radius)/60);

        for(var i =l; i<= r; i++){
            if(this._map.mapArray[i][u] === 1){
                return true;
            }
            if(this._map.mapArray[i][d] === 1){
                return true;
            }
        }
        for(var i =d; i<= u; i++){
            if(this._map.mapArray[l][i] === 1){
                return true;
            }
            if(this._map.mapArray[r][i] === 1){
                return true;
            }
        }
        return false;
    },

});