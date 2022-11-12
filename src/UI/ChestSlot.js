// this.parent: HomeUI
// this.parent.parent: LobbyScene
var ChestSlot = ccui.Button.extend({
    chest: null,
    slot: null,

    ctor: function (chest, slot) {
        this.chest = chest;
        this.slot = slot;
        if (chest.openTimeStarted === null) {
            this._super(asset.treasureEmpty_png);
            this.addClickEventListener(() => {
                if (this.parent.parent.allBtnIsActive) {
                    this.parent.parent.addChild(new ChestInfoUI(chest, this.parent.openingChestCounter, slot), 4);
                    this.parent.parent.allBtnIsActive = false;
                } else {
                    cc.log('allBtnIsActive is false');
                }
            });
            this.addIconChest();
            let textTime = new ccui.Text(Utils.milisecondsToReadableTime(chest.openTimeRequired), asset.svnSupercellMagic_ttf, 18);
            textTime.attr({
                x: this.width / 2,
                y: this.height * 0.85,
                color: cc.color(161, 180, 184),
            });
            textTime.enableShadow();
            this.addChild(textTime);
        } else {
            let openTimePassed = Date.now() - chest.openTimeStarted;
            if (openTimePassed < chest.openTimeRequired) {
                this._super(asset.treasureOpening_png);
                this.addClickEventListener(() => {
                    if (this.parent.parent.allBtnIsActive) {
                        this.parent.parent.addChild(new ChestInfoUI(chest, this.parent.openingChestCounter, slot), 4);
                        this.parent.parent.allBtnIsActive = false;
                    } else {
                        cc.log('allBtnIsActive is false');
                    }
                });
                this.addIconChest();
                let textOpen = new ccui.Text('Mở ngay', asset.svnSupercellMagic_ttf, 16);
                textOpen.attr({
                    x: this.width / 2,
                    y: this.height * 0.35,
                    color: cc.color(50, 241, 134),
                });
                textOpen.enableShadow();
                this.addChild(textOpen);
                let iconGem = new cc.Sprite(asset.iconGem_png);
                iconGem.attr({
                    x: this.width * 0.6,
                    y: this.height * 0.2,
                    scale: this.height * 0.15 / iconGem.height,
                });
                this.addChild(iconGem);
                let textOpenCost = new ccui.Text(Utils.gemCostToOpenChest(chest.openTimeRequired - openTimePassed), asset.svnSupercellMagic_ttf, 20);
                textOpenCost.attr({
                    x: this.width * 0.4,
                    y: this.height * 0.2,
                });
                textOpenCost.enableShadow();
                this.addChild(textOpenCost);
                this.textOpenCost = textOpenCost;
                let openingTimePanel = new cc.Sprite(asset.treasureOpeningTime_png);
                openingTimePanel.attr({
                    x: this.width * 0.5,
                    y: this.height * 0.9,
                    scale: this.width * 1 / openingTimePanel.width,
                });
                this.addChild(openingTimePanel);
                let iconTime = new cc.Sprite(asset.iconTime_png);
                iconTime.attr({
                    anchorX: 0,
                    x: -2,
                    y: openingTimePanel.height / 2,
                    scale: openingTimePanel.height * 1.2 / iconTime.height,
                });
                openingTimePanel.addChild(iconTime, 0);
                let textTime = new ccui.Text(Utils.milisecondsToReadableTime(chest.openTimeRequired - openTimePassed), asset.svnSupercellMagic_ttf, 18);
                textTime.attr({
                    x: openingTimePanel.width * 0.55,
                    y: openingTimePanel.height / 2,
                    color: cc.color(59, 67, 80),
                    scale: openingTimePanel.height * 0.7 / textTime.height,
                });
                this.textTime = textTime;
                openingTimePanel.addChild(textTime, 0);
            } else {
                this._super(asset.treasureFinished_png);
                this.addClickEventListener(() => {
                    if (this.parent.parent.allBtnIsActive) {
                        this.parent.sendRequestOpenChestSlot(slot);
                    } else {
                        cc.log('allBtnIsActive is false');
                    }
                });
                this.addIconChest();
                let textOpen = new ccui.Text('Mở ngay', asset.svnSupercellMagic_ttf, 16);
                textOpen.attr({
                    x: this.width / 2,
                    y: this.height * 0.2,
                });
                textOpen.enableShadow();
                this.addChild(textOpen);
            }
        }
    },

    addIconChest: function () {
        let iconChest = new cc.Sprite(asset.commonTreasure_png);
        iconChest.attr({
            x: this.width / 2,
            y: this.height / 2,
            scale: this.width * 0.6 / iconChest.width,
        });
        this.addChild(iconChest);
    },
});
