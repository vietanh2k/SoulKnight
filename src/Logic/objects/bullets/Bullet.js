var Bullet = cc.Sprite.extend({
    fx: null,
    concept: "bullet",
    ctor: function (res, target, speed, damage, radius, position, fromTower,targetType, level) {
        this._super(res);

        this.mapId = -1;
        this.reset(target, speed, damage, radius, position, fromTower,targetType, level);
    },
    
    reset: function (target, speed, damage, radius, position, fromTower,targetType, level) {
        this.target = target;
        this.speed = speed * cf.BULLET_SPEED_MULTIPLIER;
        this.damage = damage;
        this.radius = radius;
        this.isDestroy = false;
        this.position = position;
        this.targetType = targetType;
        this.level = level;
        this.active = true;
        this.lastLoc = new Vec2(position.x, position.y);
        this.activate = true;

        if (this.target && this.target.retain) {
            this.target.retain();
        }

        if (!fromTower) {
            throw '[ERROR]: Where is this bullet fire from ????';
        }

        this.fromTower = fromTower
        if (this.fromTower && this.fromTower.retain) {
            this.fromTower.retain();
        }
    },

    getTargetPosition: function () {
        if (this.targetIsLocked || this.target == null || this.target.isDestroy) {
            return this.lastLoc;
        }
        if (this.target.hasOwnProperty("position")) {
            this.lastLoc = new Vec2(this.target.position.x, this.target.position.y);
            if (this.type === 'straight') {
                this.targetIsLocked = true;
            }
            return this.target.position;
        } else {
            this.lastLoc = new Vec2(this.target.x, this.target.y);
            if (this.type === 'straight') {
                this.targetIsLocked = true;
            }
            return this.target;
        }
    },

    canAttack: function (object) {
        return object.concept === 'monster';
    },

    render: function (playerState) {
        this.renderRule = playerState.rule;
        if (this.renderRule === 1) {
            let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2;
            let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3;
            let height = dy + CELLWIDTH * 5;
            let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH;
            let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH;
            this.x = dx + x;
            this.y = height - y;
        } else {
            let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2;
            let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3;
            let height = dy + CELLWIDTH * 6;
            let width = dx + CELLWIDTH * 7;
            let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH;
            let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH;
            this.x = width - x;
            this.y = height + y;
        }
    },

    logicUpdate: function (playerState, dt) {
        if (this.active) {
            let pos = this.getTargetPosition();
            if (!pos || this.target.isDestroy) {
                this.explose(playerState, this.lastLoc);
                return;
            }
            if (euclid_distance(this.position, pos) > this.speed * dt) {
                let direction = pos.sub(this.position).l2norm();
                this.position.x += direction.x * this.speed * dt;
                this.position.y += direction.y * this.speed * dt;
            } else {
                this.explose(playerState, pos);
            }
        }
    },

    explose: function (playerState, pos) {
        const map = playerState.getMap();

        let objectList = map.getObjectInRange(pos, this.radius);
        for (let object of objectList) {
            if (this.canAttack(object) && (this.targetType === 'all' || this.targetType === object.class)) {
                object.takeDamage(playerState, this.damage, this.fromTower);
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
        if (this.fromTower && this.fromTower.release) {
            this.fromTower.release();
        }
    }
})
