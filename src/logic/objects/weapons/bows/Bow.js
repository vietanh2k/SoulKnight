var Bow = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.bow, posLogic, map);
        this.rateSpeed = 2;
        this.rang = 1500;    //range
        this.dame = 2;
        this.accuracy = 1;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang)

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

        var bullet = new  Arrow(rule, posLogic, this._map, dirBullet,dame, rang)
        BackgroundLayerInstance.objectView.addBullet(bullet)
    },


});