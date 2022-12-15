
const SpeedEffect = Effect.extend({
    ctor: function (time , rateSpeed, monster) {
        this._super(time)

        this.monster = monster;
        this.rateSpeed = rateSpeed;
        this.monster.rateSpeedUpBuff = rateSpeed;
        this.monster.retain()
    },

    update: function (playerState, dt) {

    },

    destroy: function (playerState) {
        this.monster.___SpeedEffect = null
        this.monster.rateSpeedUpBuff = 1;
        this.monster.release()
    }
})