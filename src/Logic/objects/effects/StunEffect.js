const StunEffect = Effect.extend({

    ctor: function (time, target) {
        this._super(time);

        this.target = target;
        this.target.inactiveSourceCounter++;
        // todo animation stun
        if(this.target.concept === 'monster' && !this.target.isDestroy) {
            this.target.play(-1);
        }
        this.target.retain();
    },

    destroy: function (playerState) {
        this.target.inactiveSourceCounter--;
        if (this.target.concept === 'monster' && !this.target.isDestroy) {
            this.target.play(0);
        }
        // todo animation stun
        this.target.stunEffect = undefined;
        this.target.release();
    }
});
