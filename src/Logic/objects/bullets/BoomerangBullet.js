let TBoomerangBullet = Bullet.extend({
    name: 'boomerang',
    concept: 'bullet',
    type: 'boomerang',

    ctor: function (target, speed, damage, radius, position, targetType, level, range) {
        this._super(res.TBoomerangBullet, target, speed, damage, radius, position, targetType);
        this.originalPosition = new Vec2(position.x, position.y);
        this.range = range;
        this.level = level;
        this.bulletRadius = 0.4;

        this.runBulletAnimation();
    },

    runBulletAnimation: function () {
        cc.spriteFrameCache.addSpriteFrames('res/tower/frame/boomerang/tower_boomerang_bullet_' + this.level + '.plist');
        let frame = Utils.loadAnimation(0, cf.TOWER_UI[18].bulletIPD, 'tower_boomerang_bullet_' + this.level + '_');
        this.runAction(cc.animate(new cc.Animation(frame, 0.1 / cf.TOWER_UI[18].bulletIPD)).repeatForever());
    },

    getTargetPosition: function () {
        if (this.boomerangPhase !== undefined) {
            if (this.boomerangPhase === 0) {
                return this.boomerangEnd;
            }
            if (this.boomerangPhase === 1) {
                return this.originalPosition;
            }
        }
        let aim;
        if (this.target.hasOwnProperty("position")) {
            aim = new Vec2(this.target.position.x, this.target.position.y);
        } else {
            aim = new Vec2(this.target.x, this.target.y);
        }
        let ratio = this.range * MAP_CONFIG.CELL_WIDTH / euclid_distance(this.originalPosition, aim);
        this.boomerangEnd = new Vec2(
            ratio * (aim.x - this.originalPosition.x) + this.originalPosition.x,
            ratio * (aim.y - this.originalPosition.y) + this.originalPosition.y
        );
        this.boomerangPhase = 0;
        return this.boomerangEnd;
    },

    logicUpdate: function (playerState, dt) {
        if (this.active) {
            let pos = this.getTargetPosition();
            if (!pos) {
                this.vanish();
                return;
            }
            if (euclid_distance(this.position, pos) <= this.speed * dt) {
                if (this.boomerangPhase === 0) {
                    this.boomerangPhase = 1;
                } else if (this.boomerangPhase === 1) {
                    this.vanish();
                }
                return;
            }
            let direction = pos.sub(this.position).l2norm();
            this.position.x += direction.x * this.speed * dt;
            this.position.y += direction.y * this.speed * dt;
            this.dealDamage(playerState, this.position);
        }
    },

    dealDamage: function (playerState, pos) {
        const map = playerState.getMap();
        let objectList = map.queryEnemiesCircle(pos, this.bulletRadius * MAP_CONFIG.CELL_WIDTH);
        for (let object of objectList) {
            if (this.canAttack(object)) {
                if (this.boomerangPhase === 0 && !object.isDamagedInPhaseZero) {
                    object.isDamagedInPhaseZero = true;
                    object.takeDamage(this.damage);
                    object.hurtUI();
                } else if (this.boomerangPhase === 1 && !object.isDamagedInPhaseOne) {
                    object.isDamagedInPhaseOne = true;
                    object.takeDamage(this.damage);
                    object.hurtUI();
                }
            }
        }
    },

    vanish: function () {
        this.isDestroy = true;
        this.active = false;
        this.visible = false;

        GameUI.instance.removeChild(this);
        if (this.target && this.target.release) {
            this.target.release();
        }
    },
});
