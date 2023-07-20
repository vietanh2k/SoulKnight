var Character = AnimatedSprite.extend({
    _map: null,
    direction: null,
    radius: 0,
    speed: 300,
    posLogic: null,
    otherWeapon: null,
    weapon2: null,

    ctor: function(_res, posLogic, map) {
        this._super(_res);
        this.inactiveSourceCounter = 0;
        this.maxHp = 7;
        this.curHp = 5;
        this.maxMana = 5000;
        this.curMana = 5000;
        this.maxS = 6;
        this.curS = 4;
        this.coin = 50;
        this.isDestroy = false
        this.dirEnemy = false;      // co dang tro den enemy
        this.isCanDo = true;  //co the hoat dong
        this.setScale(0.9 * CELL_SIZE_UI / this.getContentSize().width)
        this.posLogic = posLogic;
        this.radius = 20
        this.isLeft = true; //quay trai
        cc.log("radius= "+this.radius)
        // p.scale = 1.2 * CELL_SIZE_UI / p.getContentSize().width
        this.setAnchorPoint(0.5, 0.28)
        this.otherWeapon = null;
        // this.otherWeapon = new ShortGun(posLogic, map);
        // this.otherWeapon.setPosition(this.width/2, this.height/4)
        // this.otherWeapon.visible = false
        // this.addChild(this.otherWeapon);

        this.we = new WaterGun(posLogic, map);
        this.we.setPosition(this.width/2, this.height/4)

        this.addChild(this.we)
        this.initAnimation()
        this.setCascadeOpacityEnabled(false)
        this.direction = new cc.p(1,0);
        // this.opacity = 0
        this._map = map;
        this.timeShieldStart = 0; //s
        this.timeShieldStartMax = 3;
        this.timeShieldDelay = 1;
        this.timeShieldDelayMax = 1;

        this.cdSkill = 0;
        this.cdSkillMax = 5;

        this.energyWp = 0;

    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.assassin_plist, 'idle_%01d.png', 0, 3, duration)
        const moveDownAnimId2 = this.load(res.assassin_plist, 'run_%01d.png', 0, 3, duration)

        this.play(0)
    },

    switchWeapon: function () {
        if(this.otherWeapon === null) return;

        let tmp = this.we;
        this.we = this.otherWeapon;
        this.otherWeapon = tmp;
        this.we.updatePosLogic(this.posLogic);
        this.we.updateCurDir(this.direction);
        this.we.updateDir(this.direction);
        this.we.visible = true;
        this.energyWp = this.we.energy;
        this.otherWeapon.visible = false

        GamelayerInstance.updateSwitchWp(this.we.energy, this.we.getTexture())
    },

    updateCoin: function (many) {
        this.coin = Math.max(0, this.coin + many);
        GamelayerInstance.updateCoinPaddle();
    },

    logicUpdate: function (dt) {

        this.updateTimeLogic(dt);

        if(this.timeShieldStart > 0){
            this.timeShieldStart -= dt;
        }

        if(this.timeShieldStart <= 0){
            if(this.timeShieldDelay > 0){
                this.timeShieldDelay -= dt;
            }

            if(this.timeShieldDelay <= 0) {
                this.increaShield();
                this.timeShieldDelay = this.timeShieldDelayMax;
            }
        }


        if(!this.isCanDo) return;
        this.updateActivateWp(dt);

        // this.updateDirByEnemy();
    },

    updateActivateWp: function (dt) {
        this.we.logicUpdate(dt);
        this.we.updateActivate();
    },

    increaShield: function (dt) {
        this.curS++;
        this.curS = Math.min(this.curS, this.maxS);
    },

    updateDirByEnemy: function (dt) {
        let enemy = BackgroundLayerInstance.objectView.getClosestEnemy(17000);
        if(enemy != null){
            this.dirEnemy = true;
            var dir = cc.pSub(enemy.posLogic, this.posLogic);
            this.direction = dir;
        }else {
            this.dirEnemy = false;
        }
    },

    updateMove: function (direction2, dt) {
        if(!this.isCanDo) return;

        let direction = new cc.p(direction2.x, direction2.y);

        var displacement = cc.pMult(direction, this.speed * dt);
        var newPosX = cc.pAdd(this.posLogic, cc.p(displacement.x,0));
        this.updateMoveX(newPosX);

        var newPosY = cc.pAdd(this.posLogic, cc.p(0,displacement.y));
        this.updateMoveY(newPosY);

        //update dir cua char
        if(direction.x === 0 && direction.y === 0) this.play(0)
        else this.play(1)


        let enemy = BackgroundLayerInstance.objectView.getClosestEnemy(7*GAME_CONFIG.CELLSIZE);
        if(enemy != null){
            var dir = cc.pSub(enemy.posLogic, this.posLogic);
            direction = dir;
        }

        if(direction.x > 0) {
            this.setRotationY(0)
            this.isLeft = true;
            this.direction = direction;
        }
        else if(direction.x < 0) {
            this.isLeft = false;
            this.setRotationY(180)
            this.direction = direction;
        }
        else if(direction.x === 0 && direction.y !== 0) {
            this.direction = direction;
        }


        this.updateMoveWp();

        return true;
    },

    updateMoveWp: function () {
        this.we.updatePosLogic(this.posLogic)
        this.we.updateDir(this.direction);
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
            if(this._map.mapArray[i][u] === GAME_CONFIG.MAP_BLOCK || this._map.mapArray[i][u] === GAME_CONFIG.MAP_BOX || this._map.mapArray[i][u] > 0){
                var tmp = convertIndexToPosLogic(i,u).x;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
            if(this._map.mapArray[i][d] === GAME_CONFIG.MAP_BLOCK || this._map.mapArray[i][d] === GAME_CONFIG.MAP_BOX || this._map.mapArray[i][d] > 0){
                var tmp = convertIndexToPosLogic(i,d).x;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
        }
        for(var i =d; i<= u; i++){
            if(this._map.mapArray[l][i] === GAME_CONFIG.MAP_BLOCK || this._map.mapArray[l][i] === GAME_CONFIG.MAP_BOX || this._map.mapArray[l][i] > 0){
                var tmp = convertIndexToPosLogic(l,i).x;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
            if(this._map.mapArray[r][i] === GAME_CONFIG.MAP_BLOCK || this._map.mapArray[r][i] === GAME_CONFIG.MAP_BOX || this._map.mapArray[r][i] > 0){
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
            if(this._map.mapArray[i][u] === GAME_CONFIG.MAP_BLOCK || this._map.mapArray[i][u] === GAME_CONFIG.MAP_BOX || this._map.mapArray[i][u] > 0){
                var tmp = convertIndexToPosLogic(i,u).y;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
            if(this._map.mapArray[i][d] === GAME_CONFIG.MAP_BLOCK || this._map.mapArray[i][d] === GAME_CONFIG.MAP_BOX || this._map.mapArray[i][d] > 0){
                var tmp = convertIndexToPosLogic(i,d).y;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
        }
        for(var i =d; i<= u; i++){
            if(this._map.mapArray[l][i] === GAME_CONFIG.MAP_BLOCK || this._map.mapArray[l][i] === GAME_CONFIG.MAP_BOX || this._map.mapArray[l][i] > 0){
                var tmp = convertIndexToPosLogic(l,i).y;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
            if(this._map.mapArray[r][i] === GAME_CONFIG.MAP_BLOCK || this._map.mapArray[r][i] === GAME_CONFIG.MAP_BOX || this._map.mapArray[r][i] > 0){
                var tmp = convertIndexToPosLogic(r,i).y;
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

    takeDame: function (dame) {
        if(this.isDestroy) return ;

        this.curS = this.curS - Math.floor(dame);
        if(this.curS < 0){
            this.curHp = Math.max(this.curHp + this.curS, 0);
            this.curS = 0;
        }

        this.timeShieldStart = this.timeShieldStartMax;
        // GamelayerInstance.newLvl();
        this.timeShieldDelay = 0;
        getNumDameUI(dame, cc.p(this.x, this.y))
        if(this.hp <= 0) {
            this.isDestroy = true;
            this.destroy();
        }
    },

    recoverHp: function (many) {
        many = Math.floor(many)
        this.curHp = Math.min(this.curHp + many, this.maxHp)

    },

    recoverMana: function (many) {
        many = Math.floor(many)
        this.curMana = Math.min(this.curMana + many, this.maxMana)

    },

    destroy: function () {
    },

    pressSkill: function () {
        if(this.cdSkill <= 0){
            this.activeSkill();
            this.cdSkill = this.cdSkillMax;
        }
    },

    activeSkill: function () {
    },

    updateTimeLogic: function (dt) {
        if(this.cdSkill > 0){
            this.cdSkill -= dt;
        }
    },

    render: function () {
        var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        this.setPosition(posUI)
        this.setLocalZOrder(winSize.height - this.y + CELL_SIZE_UI);
    },

    updateMana: function () {
        this.curMana -= this.energyWp;
        if(this.curMana < 0) this.curMana = 0;
    },

    pickWp: function (wp) {
        if(this.otherWeapon === null){
            this.otherWeapon = wp;
            this.otherWeapon.setPosition(this.width/2, this.height/4)
            this.otherWeapon.visible = false
            this.addChild(this.otherWeapon);
            this.switchWeapon();
        }else{

            let pos = new cc.p(this.posLogic.x, this.posLogic.y);
            let item = new Item(GAME_CONFIG.ITEM_WEAPON, this.we.getId(), pos);
            BackgroundLayerInstance.objectView.addItem(item)
            this.we.removeFromParent(true);
            this.we = wp;
            this.we.setPosition(this.width/2, this.height/4)
            this.we.visible = true
            this.addChild(this.we);
            GamelayerInstance.updateSwitchWp(this.we.energy, this.we.getTexture())
        }
    },

    removeSkill: function () {

    },


});