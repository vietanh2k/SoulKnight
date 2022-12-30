const Effect = cc.Class.extend({
    ctor: function (time) {
        this.time = time
        this.countDownTime = time
        this.isDestroyed = false
    },

    logicUpdate: function (playerState, dt) {
        this.update(playerState, dt)

        if ((this.countDownTime -= dt) <= 0) {
            this.isDestroyed = true
            this.destroy()
        }
    },

    update: function (playerState, dt) {

    },

    reset: function (playerState) {
        this.countDownTime = this.time
    },

    resetWithAttr: function (playerState) {

    },

    destroy: function (playerState) {

    },
})