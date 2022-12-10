let TCannonBullet = Bullet.extend({
    name: 'cannon',
    concept: "bullet",
    type: 'chasing',

    ctor: function (target, speed, damage, radius, position) {
        this._super(res.TCannon_Bullet, target, speed, damage, radius, position);
    },
});

let TIceGunBullet = Bullet.extend({
    name: 'cannon',
    concept: "bullet",
    type: 'chasing',

    ctor: function (target, speed, damage, radius, position, level) {
        this._super(res.TIceGun_Bullet, target, speed, damage, radius, position);
        this.level = level;
    },

    explose: function (playerState, pos) {
        const map = playerState.getMap();
        let objectList = map.getObjectInRange(pos, this.radius);
        for (let object of objectList) {
            if (this.canAttack(object)) {
                object.takeDamage(this.damage);
                object.freeze(this.getFreezeDuration());
                object.hurtUI();
            }
        }
        this.isDestroy = true;
        this.active = false;
        this.visible = false;

        GameUI.instance.removeChild(this);
        if (this.target && this.target.release) {
            this.target.release();
        }
    },

    getFreezeDuration: function () {
        // let bulletIceGunBuff = Utils.getAllObjectValues(cf.TARGET_BUFF.targetBuff).find(element => element.name === 'bulletIceGun');
        // if (bulletIceGunBuff === undefined) {
        //     Utils.addToastToRunningScene('Cannot find bullet ice gun buff!');
        //     return 0;
        // }
        // Utils.addToastToRunningScene('Freeze duration: ' + bulletIceGunBuff.duration.toString(this.level));
        // return bulletIceGunBuff.duration.toString(this.level);
        return 1.5;
    },
});
