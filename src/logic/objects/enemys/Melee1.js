var Melee1 = Enemy.extend({
    _map: null,
    direction: null,
    radius: 0,
    speed: 300,
    posLogic: null,

    ctor: function(posLogic, map) {
        this._super(res.celll, posLogic, map);
        this.rangeAtk = 2;
        this.timeDelayAtk = 2;          //thoi gian delay moi lan atk (s)
        this.timeDelayAtkMax = 2;
        this.timeBreak = 0;         //thoi gian nghi sau khi atk
        this.timeBreakMax = 1;

        this.timeDelayStartAtk = 0.7;         //thoi gian nghi sau khi atk
        this.timeDelayStartAtkMax = 0.7;

        this.we = new Spear(posLogic, map);
        this.we.setAnchorPoint(0.5, 0.3)
        this.we.setPosition(this.width/2, this.height/4)

        this.addChild(this.we)
        this.setCascadeColorEnabled(false);
    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.enemy2, '2idle_%01d.png', 0, 3, duration)
        const moveDownAnimId2 = this.load(res.enemy2, '2run_%01d.png', 0, 3, duration)

        this.play(0)
    },

    getDirMoveByType: function () {

        if(this.isChangeDir) {
            this.isChangeDir = false;
            var dir = cc.pSub(BackgroundLayerInstance.player.posLogic, this.posLogic);
            let disRan = Math.floor(Math.random() * GAME_CONFIG.CELLSIZE*2) + GAME_CONFIG.CELLSIZE*2;
            this.disMove = disRan;
            let angleTotal = 100;
            //check nhin thay char
            if(this.isCanSee){
                angleTotal = 60;
                this.isChangeDirByBlock = false;
            }else if(this.isChangeDirByBlock){
                this.checkCol += 3;
                this.isChangeDirByBlock = false;
                let temp = new cc.p(-this.dirMove.x, -this.dirMove.y);
                temp = cc.pNormalize(temp);
                dir = cc.pNormalize(dir);
                this.disMove = GAME_CONFIG.CELLSIZE*3;
                dir = cc.pAdd(temp, dir);
                if(dir.x === 0 && dir.y === 0){
                    dir = temp;
                }
                // var diff = cc.pSub(dir,temp)         // Tính vector chênh lệch giữa hai vector
                // var diffNormalized = cc.pNormalize(diff) // Lấy vector đơn vị của vector chênh lệch
                // var projectionLength = cc.pDot(temp, diffNormalized) // Tính độ dài vector phân giác
                // var projection = cc.pMult(diffNormalized, projectionLength) // Tính vector phân giác và lưu kết quả vào biến projection
                // dir = cc.pAdd(temp, projection);
                angleTotal=90;
                if(this.checkCol >=6){
                    angleTotal = 360;
                    this.checkCol -= 2;
                }
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
        if(this.timeDelayAtk > 0){
            this.timeDelayAtk -= dt;
            this.speed = 150;
        }else {
            this.speed = 300;
        }

        if(this.timeBreak > 0){
            this.timeBreak -= dt;
        }

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
        let disWithChar = cc.pDistance(this.posLogic, BackgroundLayerInstance.player.posLogic);
        if(disWithChar <= GAME_CONFIG.CELLSIZE*this.rangeAtk ){
            // this.dirMain = cc.pNormalize(cc.pSub(BackgroundLayerInstance.player.posLogic, this.posLogic));
            if(this.timeDelayAtk <= 0) {
                this.timeDelayAtk = this.timeDelayAtkMax;
                this.timeDelayStartAtk = this.timeDelayStartAtkMax;
                // this.activeAtk(this.dirMain);

                this.timeBreak = this.timeBreakMax;
                return;
            }
        }else{
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
        this.we.activateWeapon()
    },

});