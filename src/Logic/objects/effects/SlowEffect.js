const SlowEffect = Effect.extend({

    ctor: function (time, target, slowType, slowValue) {
        this._super(time);

        this.target = target;
        this.slowType = slowType;
        this.slowValue = slowValue;
        // todo animation slow
        this.target.retain();
    },

    destroy: function (playerState) {
        // todo animation slow
        this.target.slowEffect = undefined;
        this.target.release();
    }
});
