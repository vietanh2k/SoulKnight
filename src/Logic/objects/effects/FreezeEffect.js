const FreezeEffect = Effect.extend({
    ctor: function (t, targetTower) {
        this._super(t)

        this.targetTower = targetTower
        this.targetTower.active = false
        this.targetTower.setColor(cc.color(128, 128, 255))
        this.targetTower.retain()
    },

    destroy: function (playerState) {
        this.targetTower.active = true
        this.targetTower.setColor(cc.color(255, 255, 255))
        this.targetTower.___freezeEffect = null
        this.targetTower.release()
    }
})