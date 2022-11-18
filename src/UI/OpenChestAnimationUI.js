// this.parent: LobbyScene
var OpenChestAnimationUI = cc.Layer.extend({
    newCards: null,
    goldReceived: null,
    skipBtnIsUsed: false,

    ctor: function (newCards, goldReceived) {
        this._super();
        this.newCards = newCards;
        this.goldReceived = goldReceived;

        let background = new ccui.Button(asset.lobbyBackground_png);
        background.setZoomScale(0);
        background.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT / 2,
            scaleX: cf.WIDTH / background.width,
            scaleY: cf.HEIGHT / background.height,
        });
        this.addChild(background);
        background.addClickEventListener(() => {
            if (this.skipBtnIsUsed === false) {
                this.skipBtnIsUsed = true;
                this.stopAllActions();
                for (let i = 0; i < this.rewardSlots.length; i++) {
                    this.rewardSlots[i].setPosition(this.getSlotPosition(i).x, this.getSlotPosition(i).y);
                    this.rewardSlots[i].stopAllActions();
                    this.rewardSlots[i].visible = true;
                }
                this.addExitBtn();
                this.fxChest.setAnimation(0, 'open_idle', false);
            }
        });

        this.fxChest = new sp.SkeletonAnimation(asset.fxChest_json, asset.fxChest_atlas);
        this.fxChest.attr({
            x: cf.WIDTH / 2,
            y: 0,
            scale: cf.WIDTH / this.fxChest.getBoundingBox().width,
        });
        this.addChild(this.fxChest);

        let newCardsSize = newCards.length;
        let index = 0;
        this.initRewards();

        let initSequence = cc.sequence(
            cc.callFunc(() => this.fxChest.setAnimation(0, 'init', false)),
            cc.delayTime(1.2),
            cc.callFunc(() => {
                this.showReward(index);
                index++;
            }),
            cc.delayTime(1.8)
        );

        let openingSequence = cc.sequence(
            cc.callFunc(() => this.fxChest.setAnimation(0, 'opening', false)),
            cc.delayTime(0.25),
            cc.callFunc(() => {
                this.showReward(index);
                index++;
            }),
            cc.delayTime(1.75)
        ).repeat(newCardsSize - 1);

        let showAllRewardsSequence = cc.sequence(
            cc.callFunc(() => {
                this.showAllRewards();
            }),
            cc.callFunc(() => this.addExitBtn())
        );

        let sequence = cc.sequence(initSequence, openingSequence, showAllRewardsSequence);
        this.runAction(sequence);
    },

    initRewards: function () {
        this.rewardSlots = [];
        let i = 0;
        for (i = 0; i < this.newCards.length + 1; i++) {
            let slotWidth = cf.WIDTH / (3 + 4);
            let rewardSlot;
            if (i < this.newCards.length) {
                let card = new Card(this.newCards[i].type, 1, 0);
                rewardSlot = new CardSlot(card, false);
                rewardSlot.setZoomScale(0);
                rewardSlot.levelPanel.visible = false;
                rewardSlot.iconEnergy.visible = false;
                rewardSlot.progressPanel.visible = false;
                rewardSlot.addClickEventListener(() => {});

                let newFragment = this.newCards[i].fragment;
                let oldFragment = 0;
                let updatedCard = sharePlayerInfo.collection.find(card => card.type === this.newCards[i].type);
                if (updatedCard !== undefined) {
                    oldFragment = updatedCard.fragment;
                }
                this.addAmount(rewardSlot, newFragment - oldFragment);
            } else {
                rewardSlot = new cc.Sprite(asset.iconGold_png);
                this.addAmount(rewardSlot, this.goldReceived);
            }
            rewardSlot.attr({
                x: this.getSlotPosition(i).x,
                y: this.getSlotPosition(i).y,
                scale: slotWidth / rewardSlot.width,
            });
            this.addChild(rewardSlot);
            this.rewardSlots[i] = rewardSlot;
            rewardSlot.visible = false;
        }
    },

    getSlotPosition: function (i) {
        let res = {};
        let row = Math.floor(i / 3);
        let column = i - row * 3;
        let slotWidth = cf.WIDTH / (3 + 4);
        let spaceBetween = slotWidth;
        res.x = spaceBetween * (column + 1) + slotWidth * (column + 0.5);
        res.y = cf.HEIGHT * (0.85 - 0.2 * row);
        return res;
    },

    addAmount: function (node, amount) {
        let lbAmount = new ccui.Text('x' + amount, asset.svnSupercellMagic_ttf, 30);
        lbAmount.enableShadow();
        lbAmount.attr({
            x: node.width,
            y: 0,
            scale: 1 / node.scale,
        });
        node.addChild(lbAmount);
    },

    showReward: function (index) {
        let reward = this.rewardSlots[index];
        let sequence = cc.sequence(
            cc.callFunc(() => {
                reward.setPosition(cf.WIDTH / 2, cf.HEIGHT * 0.85);
                reward.visible = true;
            }),
            cc.moveBy(0.5, cc.p(0, - cf.HEIGHT * 0.1)),
            cc.DelayTime(1),
            cc.callFunc(() => {
                reward.visible = false;
                reward.setPosition(this.getSlotPosition(index).x, this.getSlotPosition(index).y);
            })
        );
        reward.runAction(sequence);
    },

    showAllRewards: function () {
        for (let i = 0; i < this.rewardSlots.length; i++) {
            this.rewardSlots[i].visible = true;
            this.rewardSlots[i].runAction(new cc.moveBy(0.25, cc.p(0, - cf.HEIGHT * 0.05)));
        }
    },

    addExitBtn: function () {
        let exitBtn = new ccui.Button(asset.btnGreen_png);
        exitBtn.setZoomScale(0);
        exitBtn.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.1,
            scale: cf.HEIGHT * 0.1 / exitBtn.height,
        });
        exitBtn.addClickEventListener(() => {
            this.destroy();
        });
        this.addChild(exitBtn);

        let lbExit = new ccui.Text('Nhận', asset.svnSupercellMagic_ttf, 24);
        lbExit.enableShadow();
        lbExit.setPosition(exitBtn.width / 2, exitBtn.height / 2);
        exitBtn.addChild(lbExit);
    },

    destroy: function () {
        this.visible = false;
        this.parent.allBtnIsActive = true;
        this.removeFromParent();
    },
});
