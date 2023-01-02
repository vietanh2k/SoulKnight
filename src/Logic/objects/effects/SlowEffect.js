const SlowEffect = Effect.extend({

    ctor: function (time, target, slowType, slowValue, source) {
        this._super(time);

        this.target = target;
        this.slowType = slowType;
        this.slowValue = slowValue;
        this.source = source;

        if (this.target.slowUI === undefined) {
            this.target.slowUI = new sp.SkeletonAnimation('res/tower/fx/tower_oil_fx.json', 'res/tower/fx/tower_oil_fx.atlas');
            this.target.slowUI.attr({
                x: this.target.width * 0.5,
                y: this.target.height * 0.5,
            });
            this.target.addChild(this.target.slowUI);
            this.target.slowUI.setAnimation(0, 'hit_target_bullet', true);
        }

        this.target.setDurationScale(1 / (1 - this.slowValue));

        this.target.retain();
    },

    resetWithAttr: function (playerState, newTime, newSlowValue) {
        this.time = newTime;
        this.countDownTime = newTime;
        this.slowValue = newSlowValue;
        this.target.setDurationScale(1 / (1 - this.slowValue));
    },

    destroy: function (playerState) {
        if (this.target.slowUI !== undefined) {
            this.target.slowUI.removeFromParent(true);
            this.target.slowUI = undefined;
        }

        this.target.setDurationScale(1);

        switch (this.source) {
            case cf.SLOW_SOURCE.TOILGUN:
                this.target.slowEffectFromTOilGun = undefined;
                break;
            case cf.SLOW_SOURCE.TDAMAGE:
                this.target.slowEffectFromTDamage = undefined;
                break;
            default:
                cc.log('Unknown source!');
                break;
        }
        this.target.release();
    }
});
