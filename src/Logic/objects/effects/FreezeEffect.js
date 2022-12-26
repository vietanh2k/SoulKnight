const FreezeEffect = Effect.extend({
    ctor: function (time, target) {
        this._super(time)

        this.target = target
        if(this.target instanceof Monster && !this.target.isDestroy) {
            this.target.play(-1)
            this.target.inactiveSourceCounter++;
            this.target.active = false;
        }else {
            this.target.active = false;
        }

        this.target.setColor(cc.color(128, 128, 255))

        this.target.retain()
    },

    destroy: function (playerState) {

        this.target.setColor(cc.color(255, 255, 255))
        if(this.target instanceof Monster && !this.target.isDestroy) {
            this.target.play(0)
            if ((--this.target.inactiveSourceCounter) === 0) {
                this.target.active = true;
            }
        }else {
            this.target.active = true;
        }
        this.target.___freezeEffect = null
        this.target.release()
    }
})