var Bazoka = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.bazoka, posLogic, map);
        this.rateSpeed = 0.6;
        this.rang = 1500;    //range
        this.dame = 14;
        this.accuracy = 1;
        this.critRate = 0.1;
        this.critDame = 1.5;
        this.speed  = 600;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang, this.speed)
        this.energy = 5;

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

        var bullet = new  Rocket(rule, posLogic, this._map, dirBullet,dame, rang, this.speed)
        BackgroundLayerInstance.objectView.addBullet(bullet)
    },

    getClone: function (pos) {
        let wp = new Bazoka(pos, this._map);
        return wp;
    },

    getId: function() {
        return cf.WP_TYPE.BAZOKA_GUN;
    }

});