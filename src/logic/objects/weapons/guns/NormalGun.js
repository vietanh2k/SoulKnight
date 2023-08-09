var NormalGun = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.gun3, posLogic, map);
        this.rateSpeed = 5;
        this.rang = 900;    //range
        this.dame = 2;
        this.accuracy = 0.9;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.speed  = 500;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang, this.speed)

    },

    activateWeapon: function (rule) {

        //tinh goc lech accuracy
        let dirBullet = this.getDirBulletByAccu();

        //tinh dame crit
        let dame = this.getDameByCrit();

        this.createBullet(rule, dame, dirBullet, this.rang);

    },

    createBullet: function (rule, dame, dirBullet, rang) {
        //tinh pos dau sung
        var posLogic = new cc.p(this.posLogic.x,this.posLogic.y);
        var dir = new cc.p(this.curDir.x, this.curDir.y);
        dir = cc.pNormalize(dir)
        posLogic = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))

        var bullet = new  NorBullet(rule, posLogic, this._map, dirBullet,dame, rang, this.speed)
        BackgroundLayerInstance.objectView.addBullet(bullet)
    },

    getClone: function (pos) {
        let wp = new NormalGun(pos, this._map);
        return wp;
    },

    getId: function() {
        return cf.WP_TYPE.NORMAL_GUN;
    }

});