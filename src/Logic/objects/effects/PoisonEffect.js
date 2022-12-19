const PoisonEffect = Effect.extend({

    ctor: function (time, target, dps) {
        this._super(time);

        this.target = target;
        this.dps = dps;
        // todo animation poison
        this.target.retain();
    },

    destroy: function (playerState) {
        // todo animation poison
        this.target.poisonEffect = undefined;
        this.target.release();
    },
});
