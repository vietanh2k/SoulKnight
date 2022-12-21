let TCannonBullet = Bullet.extend({
    name: 'cannon',
    concept: "bullet",
    type: 'chasing',

    ctor: function (target, speed, damage, radius, position, fromTower, targetType, level) {
        this._super(res.TCannon_Bullet, target, speed, damage, radius, position, fromTower, targetType, level);
    },

    explose: function (playerState, pos) {
        if (this.canAttack(this.target) && (this.targetType === 'all' || this.targetType === this.target.class)) {
            this.target.takeDamage(playerState, this.damage, this.fromTower);
            cc.log('Monster HP: ' + this.target.health + ', position: ' + this.target.position + ', frame: ' + GameStateManagerInstance.frameCount)
            if (this.level === 3) {
                if (this.target.stunEffect !== undefined) {
                    this.target.stunEffect.reset();
                } else {
                    this.target.stunEffect = new StunEffect(this.getStunDuration(), this.target);
                    playerState.getMap().addEffect(this.target.stunEffect);
                }
            }
            this.target.hurtUI();
        }

        this.isDestroy = true;
        this.active = false;
        this.visible = false;

        GameUI.instance.removeChild(this);
        if (this.target && this.target.release) {
            this.target.release();
        }
    },

    getStunDuration: function () {
        return 0.2;
    },
});

let TIceGunBullet = Bullet.extend({
    name: 'cannon',
    concept: "bullet",
    type: 'chasing',

    ctor: function (target, speed, damage, radius, position, fromTower, targetType, level) {
        this._super(res.TIceGun_Bullet, target, speed, damage, radius, position, fromTower, targetType, level);
    },

    explose: function (playerState, pos) {
        if (this.canAttack(this.target) && (this.targetType === 'all' || this.targetType === this.target.class)) {
            this.target.takeDamage(playerState, this.damage, this.fromTower);
            this.target.tIceGunEffect = new TIceGunEffect(this.getFreezeDuration(), this.target, this.level === 3);
            playerState.getMap().addEffect(this.target.tIceGunEffect);
            this.target.hurtUI();
        }

        this.isDestroy = true;
        this.active = false;
        this.visible = false;

        cc.log('exlose frame: ' + GameStateManagerInstance.frameCount)

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
