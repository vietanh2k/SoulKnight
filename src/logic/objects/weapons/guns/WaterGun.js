var WaterGun = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.gun, posLogic, map);
        this.rateSpeed = 1;
        this.rang = 900;    //range
        this.dame = 1;
        this.accuracy = 0.97;
        this.critRate = 0;
        this.critDame = 1;
        this.speed  = 500;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang, this.speed)

        this.numBullet = 0;
        this.timePerBullet = 0;
        this.timePerBulletMax = 0.1;
    },

    logicUpdate: function (dt) {
        if((this.timePerBullet -= dt) <= 0){
            if(this.numBullet > 0){
                //tinh goc lech accuracy
                let dirBullet = this.getDirBulletByAccu();
                //tinh dame crit
                let dame = this.getDameByCrit();
                this.createBullet(1, dame, dirBullet, this.rang);
                this.numBullet--;
            }
            this.timePerBullet = this.timePerBulletMax;
        }
    },

    activateWeapon: function (rule) {
        this.numBullet = 5;


    },

    createBullet: function (rule, dame, dirBullet, rang) {
        //tinh pos dau sung
        var posLogic = new cc.p(this.posLogic.x,this.posLogic.y);
        var dir = new cc.p(this.curDir.x, this.curDir.y);
        dir = cc.pNormalize(dir)
        posLogic = cc.pAdd(posLogic, cc.pMult(dir, this.width))

        var bullet = new  WaterBullet(rule, posLogic, this._map, dirBullet,dame, rang, this.speed)
        BackgroundLayerInstance.objectView.addBullet(bullet)
    },

    getClone: function (pos) {
        let wp = new WaterGun(pos, this._map);
        return wp;
    },

    getId: function() {
        return cf.WP_TYPE.WATER_GUN;
    }

});