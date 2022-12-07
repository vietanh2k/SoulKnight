var _TW_BULLET = _TW_BULLET||[]
var TCannonBullet = Bullet.extend({
    name:'cannon',
    concept:"bullet",
    ctor: function (target, speed, damage, radius, position, fromTower) {
        this._super(res.TCannon_Bullet, target, speed, damage, radius, position, fromTower);

    },

})


