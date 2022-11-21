// this.parent: CardInfoUI.midPanelBackground
var StatSlot = cc.Sprite.extend({

    ctor: function (texture, textAttribute, textStat, textUpgradeStat) {
        this._super(asset.cardPanelStat_png);

        let statIcon = new cc.Sprite(texture);
        statIcon.attr({
            x: this.width * 0.13,
            y: this.height / 2,
        });
        this.addChild(statIcon);

        let lbAttribute = new ccui.Text(textAttribute, asset.svnSupercellMagic_ttf, 16);
        lbAttribute.attr({
            anchorX: 0,
            x: this.width * 0.3,
            y: this.height * 0.7,
            color: cc.color(58, 85, 100),
        });
        this.addChild(lbAttribute);

        let lbStat = new ccui.Text(textStat, asset.svnSupercellMagic_ttf, 20);
        lbStat.attr({
            anchorX: 0,
            x: this.width * 0.3,
            y: this.height * 0.4,
        });
        lbStat.enableOutline(cc.color(0, 0, 0));
        this.addChild(lbStat);

        if (textUpgradeStat !== undefined) {
            this.lbUpgradeStat = new ccui.Text(textUpgradeStat, asset.svnSupercellMagic_ttf, 16);
            this.lbUpgradeStat.attr({
                anchorX: 0,
                x: lbStat.x + lbStat.width + this.width * 0.1,
                y: this.height * 0.3,
                color: cc.color(27, 240, 87),
            });
            lbStat.enableOutline(cc.color(0, 0, 0));
            this.addChild(this.lbUpgradeStat);
        }
    },
});
