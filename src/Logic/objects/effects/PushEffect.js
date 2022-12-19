
const PushEffect = Effect.extend({
    ctor: function (vecPush , timePush, monster) {
        this._super(timePush)

        this.monster = monster;
        this.monster.setPushStat(vecPush);
        this.monster.play(-1)
        this.monster.retain()
    },

    update: function (playerState, dt) {
    },

    destroy: function (playerState) {
        this.monster.___pushEffect = null;
        this.monster.play(0)
        this.monster.release()
    }
})