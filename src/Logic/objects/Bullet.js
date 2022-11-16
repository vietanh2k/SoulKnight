var Bullet = cc.Class.extend({
    ctor: function (target, speed, damage, radius) {
        this._super();
        this.target = target
        this.speed = speed
        this.damage = damage
        this.radius = radius

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
        if (this.target.hasOwnProperty("position")) {
            return this.target.position
        } else {
            return this.target
        }
    },
    canAttack: function (object) {
        return false;

    },
    logicUpdate: function (playerState, dt) {
        if (this.active) {
            if (euclid_distance(position, getTargetPosition()) > getSpeed()) {
                let direction = this.getTargetPosition().sub(position).l2norm();
                this.position.x += direction.x * this.getSpeed() * dt;
                this.position.y += direction.y * this.getSpeed() * dt;
            } else {
                this.explose(playerState);
                active = false;
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
    }


})
