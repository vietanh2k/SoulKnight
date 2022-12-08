const DesertKingEffect = Effect.extend({
    ctor: function (targetMonster, desertKing) {
        this._super(99999999)

        this.targetMonster = targetMonster
        this.targetMonster.retain()
        this.desertKing = desertKing
        this.desertKing.retain()
    },

    update: function (playerState, dt) {
        if (this.desertKing.isDestroy || !Circle.isCirclesOverlapped(this.targetMonster.position, this.targetMonster.hitRadius,
                this.desertKing.position, this.desertKing.effectRadius)) {
            this.countDownTime = 0
            this.targetMonster.takeDamage = this.targetMonster.___originalTakeDamage
        }
    },

    destroy: function (playerState) {
        this.targetMonster.release()
        this.desertKing.release()
    }
})