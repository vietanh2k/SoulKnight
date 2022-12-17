const DamageBuffEffect = Effect.extend({

    ctor: function (time, target, damageAdjustment) {
        this._super(time);

        this.target = target;
        this.damageAdjustment = damageAdjustment;
        this.target.retain();
    },

    destroy: function (playerState) {
        this.target.damageBuffEffect = undefined;
        this.target.release();
    },
});
