var NorBullet = Bullet.extend({
    _map: null,
    speed: 300,


    ctor: function( rule, posLogic, map, direction, dame, rang, speed) {
        this._super(res.bullet, rule, posLogic, map, direction, dame, rang, speed);
        this.setScale(2)

    },





});