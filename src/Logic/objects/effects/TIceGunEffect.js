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
        this.target.inactiveSourceCounter--;
        this.target.setColor(cc.color(255, 255, 255));
        if (this.target.concept === 'monster' && !this.target.isDestroy) {
            this.target.play(0);
        }
        this.target.tIceGunEffect = undefined;
        this.target.release();
    },
});
