let TWizardBullet = Bullet.extend({
    name: 'wizard',
    concept: "bullet",

    ctor: function (target, speed, damage, radius, position, explosionFx) {
        this._super(res.Wizard_Bullet, target, speed, damage, radius, position);
        this.fx = explosionFx;
    },

    playExplosionFx: function () {
        if (this.fx != null) {
            this.fx.setPosition(this.x, this.y);
            this.fx.visible = true;
            this.fx.setAnimation(0, 'hit_target_eff', false);
        }
    },

    explose: function (playerState, pos) {
        const map = playerState.getMap();
        let objectList = map.getObjectInRange(pos, this.radius);
        for (let object of objectList) {
            if (this.canAttack(object)) {
                object.takeDamage(this.damage);
                object.hurtUI();
            }
        }
        this.isDestroy = true;
        this.active = false;
        this.visible = false;
        this.playExplosionFx();
        if (this.target && this.target.release) {
            this.target.release();
        }
    }
});

let TBoomerangBullet = Bullet.extend({
    name: 'boomerang',
    concept: 'bullet',

    ctor: function (target, speed, damage, radius, position) {
        this._super(res.TCannon_Bullet, target, speed, damage, radius, position);
    },
});

let TOilGunBullet = Bullet.extend({
    name: 'boomerang',
    concept: 'bullet',

    ctor: function (target, speed, damage, radius, position) {
        this._super(res.TCannon_Bullet, target, speed, damage, radius, position);
    },
});
