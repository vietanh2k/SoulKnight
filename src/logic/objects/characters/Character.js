var Character = AnimatedSprite.extend({
    _map: null,
    direction: null,
    radius: 0,
    speed: 300,
    posLogic: null,
    otherWeapon: null,
    weapon2: null,

    ctor: function(posLogic, map) {
        this._super(res.celll);
        this.maxHp = 7;
        this.curHp = 5;
        this.maxMana = 200;
        this.curMana = 180;
        this.maxS = 6;
        this.curS = 4;
        this.isDestroy = false
        this.dirEnemy = false;      // co dang tro den enemy
        this.setScale(0.9 * CELL_SIZE_UI / this.getContentSize().width)
        this.posLogic = posLogic;
        this.radius = this.width/3 *(GAME_CONFIG.CELLSIZE/ CELL_SIZE_UI*this.scale)
        cc.log("radius= "+this.radius)
        // p.scale = 1.2 * CELL_SIZE_UI / p.getContentSize().width
        this.setAnchorPoint(0.5, 0.28)
        this.otherWeapon = new ShortGun(posLogic, map);
        this.otherWeapon.setPosition(this.width/2, this.height/4)
        this.otherWeapon.visible = false
        this.addChild(this.otherWeapon);

        this.we = new DoubleGun(posLogic, map);
        this.we.setPosition(this.width/2, this.height/4)

        this.addChild(this.we)
        this.initAnimation()
        this.setCascadeOpacityEnabled(false)
        this.direction = new cc.p(1,0);
        // this.opacity = 0
        this._map = map;
        this.switchWeapon()

    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.assassin_plist, 'idle_%01d.png', 0, 3, duration)
        const moveDownAnimId2 = this.load(res.assassin_plist, 'run_%01d.png', 0, 3, duration)

        this.play(0)
    },

    switchWeapon: function () {
        let tmp = this.we;
        this.we = this.otherWeapon;
        this.otherWeapon = tmp;
        this.we.updatePosLogic(this.posLogic);
        this.we.updateCurDir(this.direction);
        this.we.updateDir(this.direction);
        this.we.visible = true;
        this.otherWeapon.visible = false
    },

    logicUpdate: function (dt) {
        this.we.updateActivate();
        // this.updateDirByEnemy();
    },

    updateDirByEnemy: function (dt) {
        let enemy = BackgroundLayerInstance.objectView.getClosestEnemy(500);
        if(enemy != null){
            this.dirEnemy = true;
            var dir = cc.pSub(enemy.posLogic, this.posLogic);
            this.direction = dir;
            cc.log(this.direction.x+" "+this.direction.y)
        }else {
            this.dirEnemy = false;
        }
    },

    updateMove: function (direction2, dt) {
        let direction = new cc.p(direction2.x, direction2.y);

        var displacement = cc.pMult(direction, this.speed * dt);
        var newPosX = cc.pAdd(this.posLogic, cc.p(displacement.x,0));
        this.updateMoveX(newPosX);

        var newPosY = cc.pAdd(this.posLogic, cc.p(0,displacement.y));
        this.updateMoveY(newPosY);

        //update dir cua char
        if(direction.x === 0) this.play(0)
        if(direction.x != 0) {
            this.play(1)
        }


        let enemy = BackgroundLayerInstance.objectView.getClosestEnemy(300);
        if(enemy != null){
            var dir = cc.pSub(enemy.posLogic, this.posLogic);
            direction = dir;
        }

        if(direction.x > 0) {
            this.setRotationY(0)
            this.direction = direction;
        }
        if(direction.x < 0) {
            this.setRotationY(180)
            this.direction = direction;
        }



        this.we.updatePosLogic(this.posLogic)
        this.we.updateDir(this.direction);

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
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
            if(this._map.mapArray[i][d] === 1){
                var tmp = convertIndexToPosLogic(i,d).x;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
        }
        for(var i =d; i<= u; i++){
            if(this._map.mapArray[l][i] === 1){
                var tmp = convertIndexToPosLogic(l,i).x;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
            if(this._map.mapArray[r][i] === 1){
                var tmp = convertIndexToPosLogic(r,i).x;
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
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
            if(this._map.mapArray[i][d] === 1){
                var tmp = convertIndexToPosLogic(i,d).y;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
        }
        for(var i =d; i<= u; i++){
            if(this._map.mapArray[l][i] === 1){
                var tmp = convertIndexToPosLogic(l,i).y;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
            if(this._map.mapArray[r][i] === 1){
                var tmp = convertIndexToPosLogic(r,i).y;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
        }
        return newPos.y;
    },

    getCorrectPos: function (posVC, posPlayer) {
        if(posVC > posPlayer) {
            return posVC - 30 - this.radius-1;
        }else{
            return posVC + 30 + this.radius+1;
        }
    },

    createBullet: function () {
        return this.we.createBullet()
    },


    render: function () {
        var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        this.setPosition(posUI)
    },


});