POSION_DAME = 1;
TIME_PER_POSION = 1;

const PosionEffect = Effect.extend({
    ctor: function (time, target) {

        this._super(time)
        this.target = target

        this.sumDt = 0;
        this.numDame = POSION_DAME;

        if(!this.target.isDestroy) {
            this.target.setColor(cc.color(29, 145, 72))
            target.speed = target.speed*0.6;
        }




        this.target.retain()
    },

    update: function (playerState, dt) {
        this.sumDt += dt;
        while (this.sumDt > TIME_PER_POSION) {
            this.sumDt -= TIME_PER_POSION
            this.target.takeDame(this.numDame)
        }
    },

    destroy: function () {

        if(!this.target.isDestroy) {
            this.target.setColor(cc.color(255, 255, 255));
            this.target.speed = this.target.maxSpeed;
        }


        this.target.___posionEffect = null
        this.target.release()
    }
})