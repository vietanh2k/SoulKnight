const StunEffect = Effect.extend({

    ctor: function (time, target) {
        this._super(time);

        this.target = target;

        if (this.target.stunUI === undefined) {
            this.target.stunUI = new sp.SkeletonAnimation(asset.effectStun_json, asset.effectStun_atlas);
            this.target.stunUI.attr({
                x: this.target.width * 0.5,
                y: this.target.height * 0.8,
                scale: 0.8,
            });
            this.target.addChild(this.target.stunUI);
            this.target.stunUI.setAnimation(0, 'animation', true);
        }

        if (this.target instanceof Monster && !this.target.isDestroy) {
            this.target.play(-1);
            this.target.inactiveSourceCounter++;
            this.target.active = false;
        } else {
            this.target.active = false;
        }

        this.target.retain();
    },

    destroy: function (playerState) {
        if (this.target instanceof Monster && !this.target.isDestroy) {
            this.target.play(0);
            if ((--this.target.inactiveSourceCounter) === 0) {
                this.target.active = true;
            }
        } else {
            this.target.active = true;
        }
        if (this.target.stunUI !== undefined) {
            this.target.stunUI.removeFromParent(true);
            this.target.stunUI = undefined;
        }
        this.target.stunEffect = undefined;
        this.target.release();
    }
});
