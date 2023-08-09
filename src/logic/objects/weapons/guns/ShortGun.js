var ShortGun = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.shortgun, posLogic, map);
        this.rateSpeed = 1;
        this.rang = 900;    //range
        this.dame = 2;
        this.accuracy = 1;
        this.critRate = 0;
        this.critDame = 1.5;
        this.speed  = 1000;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang, this.speed)
        this.energy = 0;

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

        let angle = 10;
        let radians = angle * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let newX = dir.x * cos - dir.y * sin;
        let newY = dir.x * sin + dir.y * cos;
        let dir1 = new cc.p(newX, newY);
        var bullet1 = new  NorBullet(rule, posLogic, this._map, dir1 ,dame, rang, this.speed)
        BackgroundLayerInstance.objectView.addBullet(bullet1);

        let angle2 = -10;
        let radians2 = angle2 * Math.PI / 180;
        let cos2 = Math.cos(radians2);
        let sin2 = Math.sin(radians2);
        let newX2 = dir.x * cos2 - dir.y * sin2;
        let newY2 = dir.x * sin2 + dir.y * cos2;
        let dir2 = new cc.p(newX2, newY2);
        var bullet2 = new  NorBullet(rule, posLogic, this._map, dir2 ,dame, rang, this.speed)
        BackgroundLayerInstance.objectView.addBullet(bullet2);

    },

    getClone: function (pos) {
        let wp = new ShortGun(pos, this._map);
        return wp;
    },

    getId: function() {
        return cf.WP_TYPE.SHORT_GUN;
    }

});