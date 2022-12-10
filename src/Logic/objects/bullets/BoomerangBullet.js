let TBoomerangBullet = Bullet.extend({
    name: 'boomerang',
    concept: 'bullet',
    type: 'boomerang',

    ctor: function (target, speed, damage, radius, position, level) {
        this._super(res.TBoomerangBullet, target, speed, damage, radius, position);
        this.originalPosition = new Vec2(position.x, position.y);
        this.level = level;

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
        if (this.targetIsLocked || this.target == null || this.target.isDestroy) {
            return this.lastLoc;
        }
        if (this.target.hasOwnProperty("position")) {
            this.boomerangEnd = this.target.position;
        } else {
            this.boomerangEnd = this.target;
        }
        this.boomerangPhase = 0;
        return this.boomerangEnd;
    },

    logicUpdate: function (playerState, dt) {
        if (this.active) {
            let pos = this.getTargetPosition();
            if (!pos) {
                this.explose(playerState, this.originalPosition);
                return;
            }
            if (euclid_distance(this.position, pos) > this.speed * dt) {
                let direction = pos.sub(this.position).l2norm();
                this.position.x += direction.x * this.speed * dt;
                this.position.y += direction.y * this.speed * dt;
            } else if (this.boomerangPhase === 0) {
                this.boomerangPhase = 1;
            } else if (this.boomerangPhase === 1) {
                this.explose(playerState, pos);
            }
        }
    },
});
