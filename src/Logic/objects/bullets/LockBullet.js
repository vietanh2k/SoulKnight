let TCannonBullet = Bullet.extend({
    name: 'cannon',
    concept: "bullet",
    type: 'chasing',
    bulletID: 1,

    ctor: function (target, speed, damage, radius, position, fromTower, targetType, level, correspondingCard) {
        this._super(res.TCannon_Bullet, target, speed, damage, radius, position, fromTower, targetType, level, correspondingCard);
    },

    explose: function (playerState, pos) {
        if (this.canAttack(this.target) && (this.targetType === 'all' || this.targetType === this.target.class)) {
            this.target.takeDamage(playerState, this.damage, this.fromTower);
            // cc.log('Monster HP: ' + this.target.health + ', position: ' + this.target.position + ', frame: ' + GameStateManagerInstance.frameCount)
            if (this.level === 3 && this.correspondingCard.isUnlockSkill()) {
                if (this.target.stunEffect !== undefined) {
                    this.target.stunEffect.resetWithAttr(playerState, this.getStunDuration());
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
    bulletID: 5,

    ctor: function (target, speed, damage, radius, position, fromTower, targetType, level, correspondingCard) {
        this._super(res.TIceGun_Bullet, target, speed, damage, radius, position, fromTower, targetType, level, correspondingCard);
    },

    explose: function (playerState, pos) {
        if (this.canAttack(this.target) && (this.targetType === 'all' || this.targetType === this.target.class)) {
            this.target.takeDamage(playerState, this.damage, this.fromTower);

            if (this.target.tIceGunEffect !== undefined) {
                this.target.tIceGunEffect.resetWithAttr(playerState, this.getFreezeDuration(), (this.level === 3 && this.correspondingCard.isUnlockSkill()));
            } else {
                this.target.tIceGunEffect = new TIceGunEffect(this.getFreezeDuration(), this.target, (this.level === 3 && this.correspondingCard.isUnlockSkill()));
                playerState.getMap().addEffect(this.target.tIceGunEffect);
            }
        }

        this.isDestroy = true;
        this.active = false;
        this.visible = false;

        // cc.log('exlose frame: ' + GameStateManagerInstance.frameCount)

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
        return 1.5 * Math.pow(cf.STAT_MULTIPLIER_PER_LEVEL, this.correspondingCard.level - 1);
    },
});
