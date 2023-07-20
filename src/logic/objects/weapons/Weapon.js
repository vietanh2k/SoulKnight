var Weapon = cc.Sprite.extend({
    _map: null,
    direction: null,
    radius: 0,
    speed: 2000,

    ctor: function(_res,posLogic, map) {
        this._super(_res);
        this.posLogic = posLogic;
        this.curDir = cc.p(1,0);
        this.setScale(0.6)
        this.setAnchorPoint(0.5, 0.5)
        this._map = map;
        this.rateSpeed = 10;
        this.rang = 200;    //range
        this.dame = 2;
        this.accuracy = 0.95;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.lastFireTime = new Date().getTime();
        this.energy = 0;

    },

    updateStat: function (dame, rateSpeed, accuracy, critRate, critDame, rang, speed) {
        this.rateSpeed = rateSpeed;
        this.rang = rang;
        this.dame = dame;
        this.accuracy = accuracy;
        this.critRate = critRate;
        this.critDame = critDame;
        this.speed = speed;
    },

    updateDir: function (direction) {
        if(direction.x == 0 && direction.y == 0) return;
        var angle = cc.pToAngle(direction);
        this.curDir = direction;

        if(direction.x > 0) {
            this.setRotation(-angle/Math.PI*180);
        }else if(direction.x < 0) {
            this.setRotation(-180+angle/Math.PI*180);
        }else if(direction.x === 0 && direction.y > 0) {
            this.setRotation(-180+90);
        }else if(direction.x === 0 && direction.y < 0) {
            this.setRotation(-180-90);
        }

        return true;
    },

    logicUpdate: function (dt) {

    },

    updatePosLogic: function (posLogic) {
        this.posLogic = posLogic;
    },

    updateCurDir: function (curDir) {
        this.curDir = curDir;
    },

    updateActivate: function (dt) {

        if(BackgroundLayerInstance.isTouchFire){
            let currentTime = new Date().getTime();
            if (currentTime - this.lastFireTime >= (1/this.rateSpeed)*1000 && BackgroundLayerInstance.player.curMana >0){
                //tinh goc lech accuracy
                this.activateWeapon(1);
                this.lastFireTime = currentTime;
                BackgroundLayerInstance.player.curMana -= this.energy;
            }

        }
    },

    //rule =1 => team minh
    //rule = 2 => team dich
    activateWeapon: function (rule) {

    },

    //tinh goc lech accuracy
    getDirBulletByAccu: function () {
        var dir = new cc.p(this.curDir.x, this.curDir.y);
        let angleTotal = 180*(1-this.accuracy);
        let angle = Math.floor(Math.random() * angleTotal)- angleTotal/2;
        let radians = angle * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let newX = dir.x * cos - dir.y * sin;
        let newY = dir.x * sin + dir.y * cos;
        let dirBullet = new cc.p(newX, newY);

        dirBullet = cc.pNormalize(dirBullet);
        return dirBullet;
    },

    getDameByCrit: function () {
        let dame = this.dame;
        let ran = Math.random();
        if(ran < this.critRate){
            dame = dame*this.critDame;
        }
        return dame;
    },

    getClone: function () {
    },

    getId: function() {
        return 0;
    }


});