/*
efect tăng speed quái, đầu vào là tỉ lệ speed
 */
const SpeedEffect = Effect.extend({
    ctor: function (time , rateSpeed, monster) {
        this._super(time)

        this.monster = monster;
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