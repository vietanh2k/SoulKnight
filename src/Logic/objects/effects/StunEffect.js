const StunEffect = Effect.extend({

    ctor: function (time, target) {
        this._super(time);

        this.target = target;
        this.target.active = false;
        // todo animation stun
        if(this.target.concept === 'monster') {
            this.target.play(-1);
        }
        this.target.retain();
    },

    destroy: function (playerState) {
        this.target.active = true;
        if(this.target.concept === 'monster') {
            this.target.play(0);
        }
        // todo animation stun
        this.target.stunEffect = undefined;
        this.target.release();
    }
});
