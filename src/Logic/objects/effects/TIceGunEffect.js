const TIceGunEffect = FreezeEffect.extend({

    ctor: function (time, target, bulletIsLevel3) {
        this._super(time, target);

        if (bulletIsLevel3) {
            this.applyVulnerableStatus();
        }
    },

    applyVulnerableStatus: function () {
        this.target.isVulnerableByTIceGun = true;

        if (this.target.vulnerableUI === undefined) {
            this.target.vulnerableUI = new sp.SkeletonAnimation(asset.iconShield_json, asset.iconShield_atlas);
            this.target.vulnerableUI.attr({
                x: this.target.width * 0.5,
                y: this.target.height * 0.8,
                scale: 0.8,
            });
            this.target.addChild(this.target.vulnerableUI);
            this.target.vulnerableUI.setAnimation(0, 'animation', true);
        }
    },

    removeVulnerableStatus: function () {
        if (this.target.isVulnerableByTIceGun) {
            this.target.isVulnerableByTIceGun = false;
            if (this.target.vulnerableUI !== undefined) {
                this.target.vulnerableUI.removeFromParent(true);
                this.target.vulnerableUI = undefined;
            }
        }
    },

    resetWithAttr: function (playerState, newTime, bulletIsLevel3) {
        this.time = newTime;
        this.countDownTime = newTime;
        if (bulletIsLevel3) {
            this.applyVulnerableStatus();
        } else {
            this.removeVulnerableStatus();
        }
    },

    destroy: function () {
        this.removeVulnerableStatus();

        this.target.setColor(cc.color(255, 255, 255))
        if(this.target instanceof Monster && !this.target.isDestroy) {
            if ((--this.target.inactiveSourceCounter) === 0) {
                this.target.play(0);
                if(this.target.UIfreeze !== null) {
                    this.target.UIfreeze.removeFromParent(true);
                    this.target.UIfreeze = null;
                }
                this.target.active = true;
            }
        } else {
            this.target.active = true;
        }

        this.target.tIceGunEffect = undefined;
        this.target.release();
    },
});
