const FreezeEffect = Effect.extend({
    ctor: function (time, target) {
        this._super(time)

        this.target = target
        this.target.inactiveSourceCounter++;
        this.target.setColor(cc.color(128, 128, 255))
        if(this.target.concept === 'monster') {
            this.target.play(-1)
        }
        this.target.retain()
    },

    destroy: function (playerState) {
        this.target.inactiveSourceCounter--;
        this.target.setColor(cc.color(255, 255, 255))
        if(this.target.concept === 'monster') {
            this.target.play(0)
        }
        this.target.___freezeEffect = null
        this.target.release()
    }
})