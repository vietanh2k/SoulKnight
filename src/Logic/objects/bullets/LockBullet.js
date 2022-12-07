var TCannonBullet = Bullet.extend({
    name:'cannon',
    concept:"bullet",

    ctor: function (target, speed, damage, radius, position) {
        this._super(res.TCannon_Bullet, target, speed, damage, radius, position);
    },
});
