var Boss = Enemy.extend({
    _map: null,
    direction: null,
    radius: 0,
    speed: 1200,
    posLogic: null,

    ctor: function(posLogic, map) {
        this._super("#sprite_01.png", posLogic, map);
        this.setScale(3 * CELL_SIZE_UI / this.getContentSize().width)
        this.radius = 100;
        this.w1 = 200;
        this.h1 = 400;
        this.hp = 200;
        this.speedMax = 300
        this.setAnchorPoint(0.5, 0.4)
        this.rangeAtk = 3;
        this.timeDelayAtk = 5;          //thoi gian delay moi lan atk (s)
        this.timeDelayAtkMax = 7;
        this.timeBreak = 3;         //thoi gian nghi sau khi atk
        this.timeBreakMax = 3;

        this.timeDelayStartAtk = 0;         //thoi gian nghi sau khi atk
        this.timeDelayStartAtkMax = 0.7;

        this.timeOpenShieldAfterAtk = 0;
        this.timeOpenShieldAfterAtkMax = 8;
        this.isShield = true;

        this.we = new Spear1(posLogic, map);
        this.we.setAnchorPoint(0.5, 0.3)
        this.we.setPosition(this.width/2, this.height/4)
        this.we.visible = false;

        this.addChild(this.we)
        this.setCascadeColorEnabled(false);

        // let a = new cc.Sprite(res.iceBullet);
        // a.setPosition(0 ,0);
        // this.addChild(a);
        this.curSkill = 0;
    },

    initAnimation: function () {
        const duration = 3
        this.aniMove = this.load(res.boss1Plist, 'sprite_%02d.png', 27, 27, duration)
        const moveDownAnimId2 = this.load(res.boss1Plist, 'sprite_%02d.png', 27, 27, duration)
        this.aniFire = this.load(res.boss1Plist, 'sprite_%02d.png', 0, 13, 1)
        this.aniShield = this.load(res.boss1Plist, 'sprite_%02d.png', 23, 29, 1)

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
        if(BackgroundLayerInstance.state === GAME_CONFIG.STATE_ONSTART){
            return;
        }

        if(this.isShield){
            this.play(this.aniMove)
        }else {
            this.play(this.aniFire)
        }

        if(this.timeDelayAtk > 0){
            this.timeDelayAtk -= dt;
        }

        if(this.timeBreak > 0){
            this.timeBreak -= dt;
        }

        if(!this.isCanDo) return;

        if(this.timeOpenShieldAfterAtk > 0){
            this.timeOpenShieldAfterAtk -= dt;
            this.isShield = false;
            this.play(this.aniFire)
            if(this.timeOpenShieldAfterAtk <= 0){
                this.isShield = true;
                this.play(this.aniMove);
            }
        }

        if(this.timeDelayStartAtk > 0){
            this.timeDelayStartAtk -= dt;
            this.timeOpenShieldAfterAtk = this.timeOpenShieldAfterAtkMax;
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
        this.chooseSkill()
    },

    skill1: function () {
        let num = 3;
        if(this.interval != null) return;
        this.interval =setInterval(()=>{
            if(this.isDestroy) {
                clearInterval(this.interval);
                return;
            }
            var posLogic = new cc.p(this.posLogic.x,this.posLogic.y);
            let ran = Math.random()* 0.4;
            for(var i= -1+ran; i<= 1; i += 0.53){
                for(var j=-1+ ran*0.5; j<=1 ; j+= 0.46){
                    if(i === 0 || j === 0) continue;
                    var dir = new cc.p(i, j);

                    dir = cc.pNormalize(dir)
                    let posLogic2 = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))

                    var bullet = new  LongBullet(2, posLogic2, this._map, dir,2, 1500, 200)
                    BackgroundLayerInstance.objectView.addBullet(bullet)
                }
            }
            if(num-- <=0) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }, 1000)
    },

    skill0: function () {
        let num = 3;
        if(this.interval != null) return;
        this.interval =setInterval(()=>{
            if(this.isDestroy) {
                clearInterval(this.interval);
                return;
            }
            var posLogic = new cc.p(this.posLogic.x,this.posLogic.y);
            let ran = Math.random()* 0.4;
            for(var i= -1+ran; i<= 1; i += 0.53){
                for(var j=-1+ ran*0.5; j<=1 ; j+= 0.46){
                    if(i === 0 || j === 0) continue;
                    var dir = new cc.p(i, j);

                    dir = cc.pNormalize(dir)
                    let posLogic2 = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))

                    var bullet = new  NorBullet(2, posLogic2, this._map, dir,2, 1500, 50)
                    BackgroundLayerInstance.objectView.addBullet(bullet)
                }
            }
            if(num-- <=0) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }, 1000)
    },

    skill2: function () {
        let num = 3;
        if(this.interval != null) return;
        this.interval =setInterval(()=>{
            if(this.isDestroy) {
                clearInterval(this.interval);
                return;
            }
            var posLogic = new cc.p(this.posLogic.x,this.posLogic.y);
            let ran = Math.random()* 0.4;
            for(var i= -1+ran; i<= 1; i += 0.53){
                for(var j=-1+ ran*0.5; j<=1 ; j+= 0.46){
                    if(i === 0 || j === 0) continue;
                    var dir = new cc.p(i, j);

                    dir = cc.pNormalize(dir)
                    let posLogic2 = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))

                    var bullet = new  NorBullet(2, posLogic2, this._map, dir,2, 1500, 50)
                    BackgroundLayerInstance.objectView.addBullet(bullet)
                }
            }
            if(num-- <=0) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }, 1000)
    },

    chooseSkill: function () {
        this.curSkill++;
        this.curSkill = this.curSkill % 3;
        if(this.curSkill === 0){
            this.skill0();
        }else if(this.curSkill === 1){
            this.skill1();
        }else if(this.curSkill === 2){
            this.skill2();
        }
    },

    takeDame: function (dame) {
        if(this.isDestroy) return ;

        if(this.isShield){
            this.hp = Math.min(this.hp + Math.floor(dame), 500);
            return;
        }

        if(this.hp <= 100){
            this.timeBreakMax = 2;
            this.timeDelayAtkMax = 4;
            this.timeOpenShieldAfterAtkMax = 5;
            this.setColor(cc.color(255,60,60,100));
            this.rangeAtk = 5;
            this.speed = 400;
        }

        this.hp = Math.max(this.hp - Math.floor(dame), 0);
        getNumDameUI(dame, cc.p(this.x, this.y))
        if(this.hp <= 0) {
            this.isDestroy = true;
            this.destroy();
        }
    },

    aniStop: function (newPosX) {
        if(this.isDestroy) return ;
    },

    aniRun: function (direction) {
        if(this.isDestroy) return ;
    },

    destroy: function () {
        this.removeFromParent(true);
        setTimeout(()=>{
            BackgroundLayerInstance.initDoorNewChap();
        }, 1500)
    },

});