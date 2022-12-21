TIME_PER_HEAL = 0.1;
/*
duy trì hồi máu mỗi 0.1s
 */
const HealMaintain = Effect.extend({
    ctor: function (time , numheal, monster) {
        this._super(time)

        this.monster = monster;
        this.sumHealDt = 0;
        this.numHealBuff = numheal;
        this.monster.retain()
    },

    update: function (playerState, dt) {
        this.sumHealDt += dt;
        while (this.sumHealDt > TIME_PER_HEAL) {
            this.sumHealDt -= TIME_PER_HEAL
            this.monster.recoverHp(this.numHealBuff)
            this.monster.hurtUI()
        }
    },

    destroy: function (playerState) {
        this.monster.___HealEffect = null
        this.monster.release()
    }
})