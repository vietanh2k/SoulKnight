const TOAST_Z_ORDER = 10000;

let Toast = cc.Layer.extend({
    lbMess: null,
    leftNotiBox: null,
    rightNotiBox: null,

    ctor: function (message, timeout = 3000) {
        this._super();
        this.zOrder = TOAST_Z_ORDER;
        this.x = cf.WIDTH / 2;
        this.y = cf.HEIGHT / 2;

        this.lbMess = new ccui.Text(message, asset.svnSupercellMagic_ttf, 18);
        this.lbMess.attr({
            x: 0,
            y: 0,
        });
        this.lbMess.enableShadow();
        this.lbMess.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.addChild(this.lbMess, TOAST_Z_ORDER + 1);

        this.leftNotiBox = new cc.Sprite(asset.commonNotificationBar_png);
        this.leftNotiBox.attr({
            anchorX: 1,
            x: 1,
            scale: (cf.WIDTH + 2) / 856,
        });
        this.addChild(this.leftNotiBox);

        this.rightNotiBox = new cc.Sprite(asset.commonNotificationBar_png);
        this.rightNotiBox.attr({
            anchorX: 0,
            x: -1,
            scale: (cf.WIDTH + 2) / 856,
            flippedX: true,
        });
        this.addChild(this.rightNotiBox);

        setTimeout(() => {
            this.destroy();
            }, timeout);
    },

    destroy: function () {
        this.visible = false;
    },
});
