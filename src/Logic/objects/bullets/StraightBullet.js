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
        let objectList = map.queryEnemiesCircle(pos, this.radius * MAP_CONFIG.CELL_WIDTH);

        let damage = this.damage;
        if (this.level === 3 && objectList.length > 5) {
            damage += 10;
        }

        let counter = 0;
        for (let object of objectList) {
            if (this.canAttack(object) && (this.targetType === 'all' || this.targetType === object.class)) {
                object.takeDamage(playerState, damage, this.fromTower);
                counter++;
                object.hurtUI();
            }
        }
        // Utils.addToastToRunningScene(objectList.length + ', ' + GameStateManagerInstance.frameCount + ', ' + this.radius + ', ' + (pos.x - pos.y))
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
        let objectList = map.queryEnemiesCircle(pos, this.radius * MAP_CONFIG.CELL_WIDTH);
        for (let object of objectList) {
            if (this.canAttack(object) && (this.targetType === 'all' || this.targetType === object.class)) {
                object.takeDamage(playerState, this.damage, this.fromTower);
                if (object.slowEffectFromTOilGun !== undefined) {
                    object.slowEffectFromTOilGun.reset();
                } else {
                    object.slowEffectFromTOilGun = new SlowEffect(this.getSlowDuration(), object, cf.SLOW_TYPE.RATIO, this.getSpeedReduced(), cf.SLOW_SOURCE.TOILGUN);
                    playerState.getMap().addEffect(object.slowEffectFromTOilGun);
                }

                // if (this.level === 3) {
                //     if (object.poisonEffect !== undefined) {
                //         object.poisonEffect.reset();
                //     } else {
                //         object.poisonEffect = new PoisonEffect(3, object, 2);
                //         playerState.getMap().addEffect(object.poisonEffect);
                //     }
                // }
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
        return 0.5;
    },

    getSlowDuration: function () {
        return 1;
    },
});
