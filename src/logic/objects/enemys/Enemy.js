var Enemy = AnimatedSprite.extend({
    _map: null,
    direction: null,
    radius: 0,
    speed: 200,
    posLogic: null,

    ctor: function(_res, posLogic, map) {
        this._super(_res);
        this.isDestroy = false
        this.setScale(0.9 * CELL_SIZE_UI / this.getContentSize().width)
        this.posLogic = posLogic;
        this.radius = 20
        this.hp = 1;
        this.we = null;
        this.dirMove = new cc.p(0,1);  // hướng di chuyển
        this.isChangeDir = true;        // có đổi hướng
        this.isChangeDirByBlock = false;        // đổi hướng khi đập tường
        this.isInRange = true;          //trong pham vi tan cong
        this.isCanSee = false;          // có nhìn thấy char
        this.isStop = false;            // có tạm nghỉ
        this.timeStop = 0;              // thời gian nghỉ
        this.disStop = GAME_CONFIG.CELLSIZE*20;  //sau khi đi được từng này thì nghỉ
        this.disMove = GAME_CONFIG.CELLSIZE;
        this.checkCol = 0;

        this.timeDelayAtk = 5;          //thoi gian delay moi lan atk (s)
        this.timeDelayAtkMax = 5;
        this.rangeAtk = 13;         //Cell_size
        this.timeBreak = 0;         //thoi gian nghi sau khi atk
        this.timeBreakMax = 0.5;

        this.dirMain = new cc.p(0,1);   // hướng mà nhắm đến
        // p.scale = 1.2 * CELL_SIZE_UI / p.getContentSize().width
        this.setAnchorPoint(0.5, 0.28)
        this.initAnimation()
        this.setCascadeOpacityEnabled(false)
        // this.opacity = 0
        this._map = map;

    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.enemy1, '1idle_%01d.png', 0, 3, duration)
        const moveDownAnimId2 = this.load(res.enemy1, '1run_%01d.png', 0, 3, duration)

        this.play(0)
    },

    takeDame: function (dame) {
        if(this.isDestroy) return ;
        this.hp = Math.max(this.hp - Math.floor(dame), 0);
        getNumDameUI(dame, cc.p(this.x, this.y))
        if(this.hp <= 0) {
            this.isDestroy = true;
            this.destroy();
        }
    },

    destroy: function () {
        this.removeFromParent(true);
    },

    logicUpdate: function (dt) {
        if(this.isDestroy) return;
        if(this.timeDelayAtk > 0){
            this.timeDelayAtk -= dt;
        }

        if(this.timeBreak > 0){
            this.timeBreak -= dt;
        }

        //attack neu trong range
        let disWithChar = cc.pDistance(this.posLogic, BackgroundLayerInstance.player.posLogic);
        if(disWithChar <= GAME_CONFIG.CELLSIZE*this.rangeAtk ){
            this.dirMain = cc.pNormalize(cc.pSub(BackgroundLayerInstance.player.posLogic, this.posLogic));
            if(this.timeDelayAtk <= 0) {
                this.timeDelayAtk = this.timeDelayAtkMax;
                this.activeAtk();
                this.timeBreak = this.timeBreakMax;
            }
        }else{
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

    getDirMoveByType: function () {

    },

    activeAtk: function () {
        // if(this.we != null) {
        //     this.we.activateWeapon(2);
        // }
    },

    isCanSeeChar: function () {
        let p0 = new cc.p(this.posLogic.x-this.radius, this.posLogic.y+this.radius)
        let p1 = new cc.p(this.posLogic.x-this.radius, this.posLogic.y-this.radius)
        let p2 = new cc.p(this.posLogic.x+this.radius, this.posLogic.y+this.radius)
        let p3 = new cc.p(this.posLogic.x+this.radius, this.posLogic.y-this.radius)

        let player = BackgroundLayerInstance.player;
        let q0 = new cc.p(player.posLogic.x-player.radius, player.posLogic.y+player.radius)
        let q1 = new cc.p(player.posLogic.x-player.radius, player.posLogic.y-player.radius)
        let q2 = new cc.p(player.posLogic.x+player.radius, player.posLogic.y+player.radius)
        let q3 = new cc.p(player.posLogic.x+player.radius, player.posLogic.y-player.radius)

        let isCol = BackgroundLayerInstance.objectView.getBlockColisionInMap(p0, q0)
        if(isCol != null){
            return false;
        }
        isCol = BackgroundLayerInstance.objectView.getBlockColisionInMap(p1, q1)
        if(isCol != null){
            return false;
        }
        isCol = BackgroundLayerInstance.objectView.getBlockColisionInMap(p2, q2)
        if(isCol != null){
            return false;
        }
        isCol = BackgroundLayerInstance.objectView.getBlockColisionInMap(p3, q3)
        if(isCol != null){
            return false;
        }

        return true;
    },

    updateMove: function (direction, dt) {
        this.aniRun(this.dirMain)

        var displacement = cc.pMult(direction, this.speed * dt);
        let distan =Math.sqrt(Math.pow(displacement.x, 2) + Math.pow(displacement.y, 2));
        var newPosX = cc.pAdd(this.posLogic, cc.p(displacement.x,0));
        this.updateMoveX(newPosX);

        var newPosY = cc.pAdd(this.posLogic, cc.p(0,displacement.y));
        this.updateMoveY(newPosY);

        this.disMove -= distan;
        if(this.disMove <= 0) this.isChangeDir = true;

        this.disStop -= distan;
        if(this.disStop <= 0){
            this.disStop = GAME_CONFIG.CELLSIZE*20;
            this.isStop = true;
            this.timeStop = Math.random() + 0.8;
        }

        return true;
    },

    updateMoveX: function (newPosX) {
        this.posLogic.x = this.checkColisionX(newPosX);
    },

    updateMoveY: function (newPosY) {
        this.posLogic.y = this.checkColisionY(newPosY);
    },

    checkColisionX: function (newPos) {
        var l = Math.floor((newPos.x - this.radius)/60);
        var r = Math.floor((newPos.x + this.radius)/60);

        var u = Math.floor((newPos.y + this.radius)/60);
        var d = Math.floor((newPos.y - this.radius)/60);

        for(var i =l; i<= r; i++){
            if(this._map.mapArray[i][u] === 1){
                var tmp = convertIndexToPosLogic(i,u).x;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
            if(this._map.mapArray[i][d] === 1){
                var tmp = convertIndexToPosLogic(i,d).x;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
        }
        for(var i =d; i<= u; i++){
            if(this._map.mapArray[l][i] === 1){
                var tmp = convertIndexToPosLogic(l,i).x;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
            if(this._map.mapArray[r][i] === 1){
                var tmp = convertIndexToPosLogic(r,i).x;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
        }
        return newPos.x;
    },

    checkColisionY: function (newPos) {
        var l = Math.floor((newPos.x - this.radius)/60);
        var r = Math.floor((newPos.x + this.radius)/60);

        var u = Math.floor((newPos.y + this.radius)/60);
        var d = Math.floor((newPos.y - this.radius)/60);

        for(var i =l; i<= r; i++){
            if(this._map.mapArray[i][u] === 1){
                var tmp = convertIndexToPosLogic(i,u).y;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
            if(this._map.mapArray[i][d] === 1){
                var tmp = convertIndexToPosLogic(i,d).y;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
        }
        for(var i =d; i<= u; i++){
            if(this._map.mapArray[l][i] === 1){
                var tmp = convertIndexToPosLogic(l,i).y;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
            if(this._map.mapArray[r][i] === 1){
                var tmp = convertIndexToPosLogic(r,i).y;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
        }
        return newPos.y;
    },

    getCorrectPos: function (posVC, posPlayer) {
        if(posVC > posPlayer) {
            return posVC - 30 - this.radius-2;
        }else{
            return posVC + 30 + this.radius+2;
        }
    },

    createBullet: function () {
        return this.we.createBullet()
    },


    render: function () {
        if(this.isDestroy) return ;
        var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        this.setPosition(posUI)
    },

    aniStop: function (newPosX) {
        if(this.isDestroy) return ;
        this.play(0)
    },

    aniRun: function (direction) {
        if(this.isDestroy) return ;
        if(direction.x === 0) this.play(0)
        if(direction.x > 0) {
            this.play(1)
            this.setRotationY(0)
        }
        if(direction.x < 0) {
            this.play(1)
            this.setRotationY(180)
        }
    },


});