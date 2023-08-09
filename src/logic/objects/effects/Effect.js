const Effect = cc.Class.extend({
    ctor: function (time) {
        this.time = time
        this.countDownTime = time
        this.isDestroyed = false
    },

    logicUpdate: function (dt) {
        this.update(dt)

        if ((this.countDownTime -= dt) <= 0) {
            this.isDestroyed = true
            this.destroy()
        }
    },

    update: function (dt) {

    },

    reset: function (playerState) {
        this.countDownTime = this.time
    },

    resetWithAttr: function (playerState) {

    },

    destroy: function (playerState) {

    },
})