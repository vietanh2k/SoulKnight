// this.parent: LobbyScene
var UpgradeCardAnimationUI = cc.Layer.extend({
    statSlots: [],
    skipBtnIsUsed: false,
    TIME_PROGRESS_ANIMATION: 1,

    ctor: function (oldCard, newCard) {
        this._super();
        this.oldCard = oldCard;
        this.newCard = newCard;

        let background = new ccui.Button(asset.lobbyBackground_png);
        background.setZoomScale(0);
        background.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT / 2,
            scaleX: cf.WIDTH / background.width,
            scaleY: cf.HEIGHT / background.height,
        });
        this.addChild(background);

        let lbName = ccui.Text(newCard.name, asset.svnSupercellMagic_ttf, 32);
        lbName.enableShadow();
        lbName.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.85,
            visible: false,
        });
        this.addChild(lbName);

        let oldCardSlot = new CardSlot(oldCard, false);
        oldCardSlot.addClickEventListener(() => {
        });
        oldCardSlot.progressPanel.visible = false;
        oldCardSlot.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.68,
            scale: cf.HEIGHT * 0.2 / oldCardSlot.height,
            opacity: 255,
        });
        oldCardSlot.getChildren().forEach(child => {
            child.opacity = 255;
            child.getChildren().forEach(grantchild => {
                grantchild.opacity = 255;
            });
        });
        this.addChild(oldCardSlot);

        let cardSlot = new CardSlot(newCard, false);
        cardSlot.addClickEventListener(() => {
        });
        cardSlot.progressPanel.visible = false;
        cardSlot.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.68,
            scale: cf.HEIGHT * 0.2 / cardSlot.height,
            opacity: 0,
        });
        this.addChild(cardSlot);

        let glossy = new cc.Sprite(asset.cardSwitchGlossy_png);
        glossy.attr({
            x: cardSlot.width / 2,
            y: cardSlot.height / 2,
            scale: cardSlot.width / glossy.width,
        });
        cardSlot.addChild(glossy);
        cardSlot.getChildren().forEach(child => {
            child.opacity = 0;
            child.getChildren().forEach(grantchild => {
                grantchild.opacity = 0;
            });
        });

        let progressPanel = new cc.Sprite(asset.progressBackground_png);
        progressPanel.attr({
            x: cf.WIDTH / 2,
            y: cardSlot.y + cardSlot.height * 0.7 * cardSlot.scale,
            scale: cardSlot.width * cardSlot.scale / progressPanel.width,
        });
        this.addChild(progressPanel);

        let progressTexture;
        if (newCard.fragment >= newCard.reqFrag) {
            progressTexture = asset.progressMax_png;
        } else {
            progressTexture = asset.progress_png;
        }
        let progress = cc.ProgressTimer.create(cc.Sprite.create(progressTexture));
        progress.setType(cc.ProgressTimer.TYPE_BAR);
        progress.setBarChangeRate(cc.p(1, 0));
        progress.setMidpoint(cc.p(0, 1));
        progress.setPercentage(100);
        progress.attr({
            x: progressPanel.width / 2,
            y: progressPanel.height / 2,
            scaleX: progressPanel.width * 0.95 / progress.width,
            scaleY: progressPanel.height * 0.8 / progress.height,
        });
        progressPanel.addChild(progress);

        for (let i = 0; i < oldCard.statTypes.length; i++) {
            this.addStatSlotToPanel(oldCard, i);
        }

        this.lbFragment = ccui.Text(oldCard.fragment, asset.svnSupercellMagic_ttf, 16);
        this.lbFragment.attr({
            x: progressPanel.width / 2,
            y: progressPanel.height / 2 * 1.1,
        });
        this.lbFragment.enableShadow();
        progressPanel.addChild(this.lbFragment);

        let sequence = cc.sequence(
            cc.DelayTime(0.5),
            cc.CallFunc(() => {
                lbName.visible = true;
                lbName.runAction(new cc.moveBy(0.25, cc.p(0, cf.HEIGHT * 0.05)));
            }),
            cc.DelayTime(0.5),
            cc.CallFunc(() => {
                let newRatioPercent = newCard.fragment / newCard.reqFrag * 100;
                progress.runAction(cc.progressTo(this.TIME_PROGRESS_ANIMATION, newRatioPercent));
                this.startTime = Date.now();
                oldCardSlot.runAction(cc.FadeOut(this.TIME_PROGRESS_ANIMATION / 2));
                oldCardSlot.getChildren().forEach(child => {
                    child.runAction(cc.FadeOut(this.TIME_PROGRESS_ANIMATION / 2));
                    child.getChildren().forEach(grantchild => {
                        grantchild.runAction(cc.FadeOut(this.TIME_PROGRESS_ANIMATION / 2));
                    });
                });
            }),
            cc.DelayTime(this.TIME_PROGRESS_ANIMATION / 2),
            cc.CallFunc(() => {
                cardSlot.runAction(cc.FadeIn(this.TIME_PROGRESS_ANIMATION / 2));
                cardSlot.getChildren().forEach(child => {
                    child.runAction(cc.FadeIn(this.TIME_PROGRESS_ANIMATION / 2));
                    child.getChildren().forEach(grantchild => {
                        grantchild.runAction(cc.FadeIn(this.TIME_PROGRESS_ANIMATION / 2));
                    });
                });
            }),
            cc.DelayTime(this.TIME_PROGRESS_ANIMATION / 2 + 0.5),
            cc.CallFunc(() => {
                glossy.runAction(cc.sequence(cc.FadeOut(1), cc.FadeIn(1)).repeatForever());
                this.showAllStatSlots();
            }),
            cc.DelayTime(0.5),
            cc.CallFunc(() => this.addExitBtn())
        );

        this.runAction(sequence);

        background.addClickEventListener(() => {
            if (this.skipBtnIsUsed === false) {
                this.skipBtnIsUsed = true;
                this.stopAllActions();
                lbName.stopAllActions();
                lbName.y = cf.HEIGHT * 0.9;
                lbName.visible = true;
                cardSlot.visible = true;
                for (let i = 0; i < this.statSlots.length; i++) {
                    this.statSlots[i].stopAllActions();
                    this.statSlots[i].y = cf.HEIGHT * (0.5 - 0.08 * i);
                    this.statSlots[i].visible = true;
                }

                progress.stopAllActions();
                progress.setPercentage(newCard.fragment / newCard.reqFrag * 100);
                this.lbFragment.setString(this.newCard.fragment);

                oldCardSlot.visible = false;
                cardSlot.opacity = 255;
                cardSlot.getChildren().forEach(child => {
                    child.opacity = 255;
                    child.getChildren().forEach(grantchild => {
                        grantchild.opacity = 255;
                    });
                });
                glossy.runAction(cc.sequence(cc.FadeOut(1), cc.FadeIn(1)).repeatForever());

                this.addExitBtn();
            }
        });

        this.scheduleUpdate();
    },

    update: function () {
        if (this.startTime !== undefined) {
            let ratio = (Date.now() - this.startTime) / this.TIME_PROGRESS_ANIMATION / 1000;
            if (ratio > 1) ratio = 1;
            let currFragment = Math.round(this.oldCard.fragment + ratio * (this.newCard.fragment - this.oldCard.fragment));
            this.lbFragment.setString(currFragment);
            if (currFragment === this.newCard.fragment) {
                this.startTime = undefined;
            }
        }
    },

    showAllStatSlots: function () {
        for (let i = 0; i < this.statSlots.length; i++) {
            this.statSlots[i].visible = true;
            this.statSlots[i].runAction(new cc.moveBy(0.25, cc.p(0, cf.HEIGHT * 0.05)));
        }
    },

    addStatSlotToPanel: function (card, index) {
        let [texture, textAttribute, textStat, textUpgradeStat] = Utils.generateCardAttributes(card, index);
        let newStatSlot = new this.StatSlotInThisUI(texture, textAttribute, textStat, textUpgradeStat);
        newStatSlot.attr({
            x: cf.WIDTH * 0.35,
            y: cf.HEIGHT * (0.45 - 0.08 * index),
            scale: cf.HEIGHT * 0.05 / newStatSlot.height,
            visible: false,
        });
        this.addChild(newStatSlot);
        this.statSlots[index] = newStatSlot;
        newStatSlot.retain();
    },

    addExitBtn: function () {
        if (this.exitBtn !== undefined) return;
        this.exitBtn = new ccui.Button(asset.btnGreen_png);
        this.exitBtn.setZoomScale(0);
        this.exitBtn.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.1,
            scale: cf.HEIGHT * 0.1 / this.exitBtn.height,
        });
        this.exitBtn.addClickEventListener(() => {
            this.destroy();
        });
        this.addChild(this.exitBtn);

        let lbExit = new ccui.Text('Đồng ý', asset.svnSupercellMagic_ttf, 24);
        lbExit.enableShadow();
        lbExit.setPosition(this.exitBtn.width / 2, this.exitBtn.height / 2);
        this.exitBtn.addChild(lbExit);
    },

    destroy: function () {
        this.visible = false;
        this.parent.addChild(new CardInfoUI(this.newCard), 4, cf.TAG_CARDINFOUI);
        this.parent.allBtnIsActive = false;
        this.removeFromParent();
    },

    StatSlotInThisUI: cc.Sprite.extend({
        ctor: function (texture, textAttribute, textStat, textUpgradeStat) {
            this._super(texture);

            let lbAttribute = new ccui.Text(textAttribute, asset.svnSupercellMagic_ttf, 16);
            lbAttribute.attr({
                anchorX: 0,
                x: this.width * 1.28,
                y: this.height * 0.9,
            });
            this.addChild(lbAttribute);

            let lbStat = new ccui.Text(textStat, asset.svnSupercellMagic_ttf, 20);
            lbStat.attr({
                anchorX: 0,
                x: this.width * 1.28,
                y: this.height * 0.35,
            });
            lbStat.enableOutline(cc.color(0, 0, 0));
            this.addChild(lbStat);

            if (textUpgradeStat !== undefined) {
                this.lbUpgradeStat = new ccui.Text(textUpgradeStat, asset.svnSupercellMagic_ttf, 20);
                this.lbUpgradeStat.attr({
                    anchorX: 0,
                    x: lbStat.x + lbStat.width * 1.1,
                    y: this.height * 0.35,
                    color: cc.color(27, 240, 87),
                });
                this.lbUpgradeStat.enableOutline(cc.color(0, 0, 0));
                this.addChild(this.lbUpgradeStat);
            }
        },
    }),
});
