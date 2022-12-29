const FreezeEffect = Effect.extend({
    ctor: function (time, target) {

        this._super(time)

        this.target = target

        if(this.target.UIfreeze === null || this.target.UIfreeze === undefined) {
            this.target.UIfreeze = new cc.Sprite('res/battle/ice.png');
            this.target.UIfreeze.setPosition(this.target.width / 2.0, this.target.height / 1.9);
            this.target.addChild(this.target.UIfreeze);
        }
        if(this.target instanceof Monster && !this.target.isDestroy) {
            this.target.play(-1)
            this.target.inactiveSourceCounter++;
            this.target.active = false;
            this.target.UIfreeze.setScale(CELLWIDTH / this.target.UIfreeze.getContentSize().width*0.5)
        }else {
            this.target.active = false;
            this.target.UIfreeze.setScale(0.9*CELLWIDTH / this.target.UIfreeze.getContentSize().width / this.target.scale)
        }


        this.target.setColor(cc.color(128, 128, 255))

        this.target.retain()
    },

    destroy: function (playerState) {
        this.target.setColor(cc.color(255, 255, 255))
        if(this.target instanceof Monster && !this.target.isDestroy) {
            if ((--this.target.inactiveSourceCounter) === 0) {
                this.target.active = true;
                this.target.play(0)
                if(this.target.UIfreeze !== null) {
                    this.target.UIfreeze.removeFromParent(true);
                    this.target.UIfreeze = null;
                }
            }
        }else {
            this.target.active = true;
            if(this.target.UIfreeze !== null) {
                this.target.UIfreeze.removeFromParent(true);
                this.target.UIfreeze = null;
            }
        }

        this.target.___freezeEffect = null
        this.target.release()
    }
})