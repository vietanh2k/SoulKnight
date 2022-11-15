var Tower = cc.Class.extends({
        ctor: function (map) {
            this.resetPending();
            this.attackCoolDown = 0;
            this.map = map;
            this.target = [];


        },
        getAttackSpeed: function () {
            return 0;
        },
        getPending: function () {
            return this.pendingSecond;
        },
        resetPending: function () {
            this.pendingSecond = this.readConfig().buildingTime / 1000;
        },
        updatePending: function (dt) {
            if (this.pendingSecond > 0) {
                this.pendingSecond -= dt;
            }
        },
        prioritize: function (object) {
            if (this.map.getDistanceBetween(object.position, this.position) <= this.getRange()) {
                this.target.unshift(object);
            }
        },
        getRange: function () {
            return 0;
        },
        fire: function () {
            if (this.target.size() > 0) {
                var bullet = this.getNewBullet(target[0]);
                this.map.addNewBullet(bullet);
            }

        },
        getNewBullet: function (object) {
            return null;
        },
        upgrade: function (card) {
            return false;
        },
        update: function (playerState, dt) {
            if (this.health <= 0) {
                active = false;
            }
            if (active) {
                if (getPending() > 0) {
                    self.updatePending(dt);
                } else {
                    this.target = [];
                    var self = this;
                    this.map.getObjectInRange(this, this.getRange()).map(function (obj) {
                        if (self.checkIsTarget(obj)) {
                            self.target.add(obj);
                        }
                    })
                    if (this.attackCoolDown <= 0) {
                        this.fire();
                        this.attackCoolDown = self.getAttackSpeed();
                    } else {
                        this.attackCoolDown -= dt * 1000;
                    }
                }

            }

        },
        checkIsTarget: function (another) {
            return false;
        }

    }
)
Tower.prototype.readConfig = function () {
    var fileUtil = cc.FileUtils.getInstance();
    var data = fileUtil.getStringFromFile('res/config/Tower.json');
    var jData = JSON.parse(data);
    return jData;
}

