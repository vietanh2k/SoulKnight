let TBoomerangBullet = Bullet.extend({
    name: 'boomerang',
    concept: 'bullet',
    type: 'boomerang',

    ctor: function (target, speed, damage, radius, position) {
        this._super(res.TCannon_Bullet, target, speed, damage, radius, position);
    },
});
