var Bullet = cc.Sprite.extend({
    ctor: function (target, speed, damage, radius, position) {
        this._super(res.Wizard_Bullet);
        this.target = target
        this.speed = speed
        this.damage = damage
        this.radius = radius
        this.isDestroy = false;
        this.concept="bullet"
        this.position = position
        this.active = true

    },

    getSpeed: function () {
        return this.speed
    },
    getDamage: function () {
        return this.damage;
    },
    getRadius: function () {
        return this.radius;
    },
    getTargetPosition: function () {
        if(this.target==undefined || this.target.isDestroy){
            return null;
        }
        if (this.target.hasOwnProperty("position")) {
            return this.target.position
        } else {
            return this.target
        }
    },
    canAttack: function (object) {
        return false;

    },
    render: function (playerState) {
        this.renderRule = playerState.rule

        if (this.renderRule === 1) {
            // dir.set(dir.x, -dir.y)
            let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
            let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
            let height = dy + CELLWIDTH * 5
            let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
            let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH

            this.x = dx + x
            this.y = height - y
        } else {
            // dir.set(-dir.x, dir.y)
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

            if (this.getTargetPosition()!=null && euclid_distance(this.position, this.getTargetPosition()) > this.getSpeed()* dt*3) {
                // cc.log('bullet í moving')
                let direction = this.getTargetPosition().sub(this.position).l2norm();
                this.position.x += direction.x * this.getSpeed() * dt;
                this.position.y += direction.y * this.getSpeed() * dt;
            } else {
                cc.log('bullet explose')
                this.explose(playerState);
            }
        }

    },

    explose: function (playerState) {
        const map = playerState.getMap();
        let objectList = map.getObjectInRange(this.getTargetPosition(), this.getRadius());
        for (let object of objectList) {
            if (this.canAttack(object)) {
                object.health -= this.getDamage();
            }
        }
        this.isDestroy = true;
        this.active = false;
        this.visible = false;
        GameUI.instance.removeChild(this)
    }


})
