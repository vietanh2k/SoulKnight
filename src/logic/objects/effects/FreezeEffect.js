const FreezeEffect = Effect.extend({
    ctor: function (time, target) {

        this._super(time)

        this.target = target
        if(!this.target.isDestroy) {
            if(this.target.UIfreeze === null || this.target.UIfreeze === undefined) {
                this.target.UIfreeze = new cc.Sprite('res/battle/ice.png');
                this.target.UIfreeze.setPosition(this.target.width / 2.0, this.target.height / 4);
                this.target.addChild(this.target.UIfreeze);
            }

            this.target.play(-1)
            this.target.inactiveSourceCounter++;
            this.target.active = false;
            this.target.isCanDo = false;
            this.target.UIfreeze.setScale(GAME_CONFIG.CELLSIZE / this.target.UIfreeze.getContentSize().width*0.2)
            this.target.setColor(cc.color(128, 128, 255))

            this.target.retain()
        }

    },

    destroy: function () {

        if(!this.target.isDestroy) {
            if ((--this.target.inactiveSourceCounter) === 0) {
                this.target.active = true;
                this.target.isCanDo = true;
                this.target.play(0)
                if(this.target.UIfreeze !== null) {
                    this.target.UIfreeze.removeFromParent(true);
                    this.target.UIfreeze = null;
                }
            }
            this.target.setColor(cc.color(255, 255, 255))
            this.target.___freezeEffect = null
            this.target.release()
        }
    }
})