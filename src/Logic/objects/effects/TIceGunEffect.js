const TIceGunEffect = FreezeEffect.extend({

    ctor: function (time, target, bulletIsLevel3) {
        this._super(time, target);

        if (bulletIsLevel3) {
            this.target.isVulnerableByTIceGun = true;
        }
    },

    destroy: function () {
        if (this.target.isVulnerableByTIceGun) {
            this.target.isVulnerableByTIceGun = false;
        }
        this.target.setColor(cc.color(255, 255, 255))
        if(this.target instanceof Monster && !this.target.isDestroy) {
            if ((--this.target.inactiveSourceCounter) === 0) {
                this.target.play(0)
                this.target.active = true;
            }
        }else {
            this.target.active = true;
        }
        if(this.target.UIfreeze !== null) {
            this.target.UIfreeze.removeFromParent(true);
            this.target.UIfreeze = null;
        }
        this.target.tIceGunEffect = undefined;
        this.target.release();
    },
});
