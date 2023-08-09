var Range1 = Enemy.extend({
    _map: null,
    direction: null,
    radius: 0,
    speed: 200,
    posLogic: null,

    ctor: function(posLogic, map) {
        this._super(res.celll, posLogic, map);
        this.we = new NormalGun(posLogic, map);
        this.we.setPosition(this.width/2, this.height/4)

        this.addChild(this.we)

        this.timePerBullet = 0.4;
        this.timePerBulletMax = 0.4;
        this.numBullet = 0;

        this.hp = 15;
        // this.setColor(cc.color(0,255,0,0))
    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.enemy8, '8idle_%01d.png', 0, 3, duration)
        const moveDownAnimId2 = this.load(res.enemy8, '8run_%01d.png', 0, 3, duration)

        this.play(0)
    },

    getDirMoveByType: function () {

        if(this.isChangeDir) {
            this.isChangeDir = false;
            var dir = cc.pSub(this.posLogic, BackgroundLayerInstance.player.posLogic);
            let disRan = Math.floor(Math.random() * GAME_CONFIG.CELLSIZE*2) + GAME_CONFIG.CELLSIZE*1;
            this.disMove = disRan;
            let angleTotal = 200;
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

        if(!this.isCanDo) return;

        if((this.timePerBullet -= dt) <= 0){
            if(this.numBullet > 0){
                this.we.activateWeapon(2);
                this.numBullet--;
            }
            this.timePerBullet = this.timePerBulletMax;
        }
        if(this.timeDelayAtk > 0){
            this.timeDelayAtk -= dt;
        }

        if(this.timeBreak > 0){
            this.timeBreak -= dt;
        }

        //attack neu trong range
        let disWithChar = cc.pDistance(this.posLogic, BackgroundLayerInstance.player.posLogic);
        if(disWithChar <= GAME_CONFIG.CELLSIZE*this.rangeAtk ){
            this.isInRange = true;
            this.dirMain = cc.pNormalize(cc.pSub(BackgroundLayerInstance.player.posLogic, this.posLogic));
            if(this.timeDelayAtk <= 0) {
                this.timeDelayAtk = this.timeDelayAtkMax;
                this.activeAtk();
                this.isChangeDir = true;
                this.timeBreak = this.timeBreakMax;
            }
        }else{
            this.isInRange = false;
            this.dirMain = this.dirMove;
        }
        if(this.we != null){
            this.we.updatePosLogic(this.posLogic)
            this.we.updateDir(this.dirMain);
        }

        if(this.timeBreak > 0){
            return;
        }

        this.isCanSee = this.isCanSeeChar();
        if(this.isCanSee){
            this.isStop = false;
        }

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

    activeAtk: function () {
        this.numBullet = 7;
    },


});