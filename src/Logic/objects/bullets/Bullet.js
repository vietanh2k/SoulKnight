var Bullet = cc.Sprite.extend({
    fx: null,
    concept: "bullet",
    ctor: function (res, target, speed, damage, radius, position) {
        this._super(res);

        this.mapId = -1

        this.reset(target, speed, damage, radius, position);

    },

    getTargetPosition: function () {
        if (this.target == undefined || this.target.isDestroy || this.target == null) {
            return this._lastLoc;
        }
        if (this.target.hasOwnProperty("position")) {
            this._lastLoc = new Vec2(this.target.position.x, this.target.position.y)
            return this.target.position

        } else {
            this._lastLoc = new Vec2(this.target.x, this.target.y)
            return this.target
        }
    },

    reset: function (target, speed, damage, radius, position) {
        this.target = target;
        this.speed = speed;
        this.damage = damage;
        this.radius = radius;
        this.isDestroy = false;
        this.position = position
        this.active = true;
        this._lastLoc = new Vec2(position.x, position.y);
        this.activate = true;

        if (this.target && this.target.retain) {
            this.target.retain();
        }
    },
    canAttack: function (object) {
        if (object.concept == 'monster') {
            return true;
        }
        return false;

    },
    render: function (playerState) {
        this.renderRule = playerState.rule

        if (this.renderRule === 1) {
            let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
            let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
            let height = dy + CELLWIDTH * 5
            let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
            let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH

            this.x = dx + x
            this.y = height - y
        } else {
            let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
            let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
            let height = dy + CELLWIDTH * 6
            let width = dx + CELLWIDTH * 7

            let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
            let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH

            this.setPosition(width - x, height + y)
        }
    },

    logicUpdate: function (playerState, dt) {
        if (this.active) {
            let pos = this.getTargetPosition();
            if (!pos) {
                // target disappear
                this.explose(playerState, this._lastLoc);
                return;
            }
            if (euclid_distance(this.position, pos) > this.speed * dt) {
                let direction = pos.sub(this.position).l2norm();
                this.position.x += direction.x * this.speed * cf.BULLET_SPEED_MULTIPLIER * dt;
                this.position.y += direction.y * this.speed * cf.BULLET_SPEED_MULTIPLIER * dt;
            } else {
                this.explose(playerState, pos);
            }
        }
    },

    explose: function (playerState, pos) {
        const map = playerState.getMap();

        let objectList = map.getObjectInRange(pos, this.radius);
        for (let object of objectList) {
            if (this.canAttack(object)) {
                //object.health -= this.damage;
                object.takeDamage(this.damage);
                object.hurtUI();
            }
        }
        this.isDestroy = true;
        this.active = false;
        this.visible = false;

        GameUI.instance.removeChild(this);
        if (this.target && this.target.release) this.target.release();
    }
})
