let TWizardBullet = Bullet.extend({
    name: 'wizard',
    concept: "bullet",
    type: 'straight',
    ctor: function (target, speed, damage, radius, position, fromTower, targetType, level, bulletFx) {
        this._super(res.Wizard_Bullet, target, speed, damage, radius, position, fromTower, targetType, level);
        this.bulletFx = bulletFx;
    },

    playExplosionFx: function () {
        if (this.bulletFx != null) {
            this.bulletFx.setPosition(this.x, this.y);
            this.bulletFx.visible = true;
            this.bulletFx.setAnimation(0, 'hit_target_eff', false);
        }
    },

    explose: function (playerState, pos) {
        const map = playerState.getMap();
        let objectList = map.getObjectInRange(pos, this.radius);
        let damage = this.damage;
        if (this.level === 3 && objectList.length > 5) {
            damage += 10;
        }
        for (let object of objectList) {
            if (this.canAttack(object) && (this.targetType === 'all' || this.targetType === object.class)) {
                object.takeDamage(playerState, this.damage, this.fromTower);
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
    },
});

let TOilGunBullet = Bullet.extend({
    name: 'oil',
    concept: 'bullet',
    type: 'straight',

    ctor: function (target, speed, damage, radius, position, fromTower, targetType, level, bulletFx) {
        this._super(res.TOilGunBullet, target, speed, damage, radius, position, fromTower, targetType, level);
        this.bulletFx = bulletFx;

        this.runBulletAnimation();
    },

    runBulletAnimation: function () {
        cc.spriteFrameCache.addSpriteFrames('res/tower/frame/oil_gun/tower_oil_gun_bullet.plist');
        let frame = Utils.loadAnimation(0, cf.TOWER_UI[19].bulletIPD, 'tower_oil_gun_bullet_');
        this.runAction(cc.animate(new cc.Animation(frame, 0.6 / cf.TOWER_UI[19].bulletIPD)).repeatForever());
    },

    playExplosionFx: function () {
        if (this.bulletFx != null) {
            this.bulletFx.setPosition(this.x, this.y);
            this.bulletFx.visible = true;
            this.bulletFx.setAnimation(0, 'hit_target_eff', false);
        }
    },

    explose: function (playerState, pos) {
        const map = playerState.getMap();
        let objectList = map.getObjectInRange(pos, this.radius);
        for (let object of objectList) {
            if (this.canAttack(object) && (this.targetType === 'all' || this.targetType === object.class)) {
                object.takeDamage(playerState, this.damage, this.fromTower)
                object.slow(this.getSpeedReduced(), this.getSlowDuration());
                // object.slowEffect = new SlowEffect(this.getSlowDuration(), object, cf.SLOW_TYPE.FLAT, this.getSpeedReduced());
                // playerState.getMap().addEffect(object.slowEffect);
                if (this.level === 3) {
                    object.poisonByTOilGun(2, 3);
                }
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
    },

    getSpeedReduced: function () {
        return 0.2 * MAP_CONFIG.CELL_WIDTH;
    },

    getSlowDuration: function () {
        return 1;
    },
});
