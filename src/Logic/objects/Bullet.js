var Bullet = cc.Sprite.extend({
    fx:null,
    ctor: function (target, speed, damage, radius, position) {
        this._super(res.Wizard_Bullet);
        this.target = target
        this.speed = 60
        this.damage = damage
        this.radius = radius
        this.isDestroy = false;
        this.concept="bullet"
        this.position = position
        this.active = true
        this._lastLoc = null

        if (this.target && this.target.retain) this.target.retain()

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
    canAttack: function (object) {
        if(object.concept=='monster'){
            return true;
        }
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
        // if(this.fx!=null||undefined){
        //     this.fx.setPosition(cc.p(this.x, this.y))
        // }
    },
    logicUpdate: function (playerState, dt) {
        if (this.active) {

            var pos = this.getTargetPosition()

            if (!pos) return;

            if (euclid_distance(this.position, pos) > this.getSpeed() * dt) {
                // cc.log('bullet í moving')
                let direction = pos.sub(this.position).l2norm();
                this.position.x += direction.x * this.getSpeed() * dt;
                this.position.y += direction.y * this.getSpeed() * dt;
            } else {
                //cc.log('bullet explose')
                this.explose(playerState, pos);
            }
            // if(this.fx!=null){
            //     this.fx.update(dt)
            // }
        }

    },

    explose: function (playerState, pos) {
        const map = playerState.getMap();
        let objectList = map.getObjectInRange(pos, this.getRadius());
        for (let object of objectList) {
            if (this.canAttack(object)) {
                object.health -= this.getDamage();
                object.hurtUI()
            }
        }
        this.isDestroy = true;
        this.active = false;
        this.visible = false;
        GameUI.instance.removeChild(this)

        if (this.target && this.target.release) this.target.release()
    }
})
