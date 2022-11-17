// this.parent: LobbyScene
var CardInfoUI = cc.Layer.extend({
    card: null,

    ctor: function (card) {
        this._super();

        this.card = card;

        let layerColor = new cc.LayerColor(cc.color(0, 0, 0), cf.WIDTH, cf.HEIGHT);
        layerColor.setOpacity(150);
        this.addChild(layerColor);

        // middle panel
        let midPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 98.25, 453, 196.5));
        midPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4,
            scale: cf.WIDTH * 0.9 / midPanelBackground.width,
        });
        this.addChild(midPanelBackground);

        let topDescriptionPanel = cc.Sprite(asset.panelFront_png, cc.rect(0, 0, 424, 114));
        topDescriptionPanel.attr({
            anchorY: 0,
            x: midPanelBackground.width / 2,
            y: midPanelBackground.height / 2,
            scale: midPanelBackground.height * 0.5 / topDescriptionPanel.height,
        });
        midPanelBackground.addChild(topDescriptionPanel);

        let botDescriptionPanel = cc.Sprite(asset.panelFront_png, cc.rect(0, 228, 424, 114));
        botDescriptionPanel.attr({
            anchorY: 1,
            x: midPanelBackground.width / 2,
            y: midPanelBackground.height / 2,
            scale: midPanelBackground.height * 0.5 / botDescriptionPanel.height,
        });
        midPanelBackground.addChild(botDescriptionPanel);

        let lbDescription = ccui.Text(this.card.description, asset.svnAvoBold_ttf, 16);
        lbDescription.attr({
            x: midPanelBackground.width / 2,
            y: midPanelBackground.height / 2,
            color: cc.color(35, 65, 155),
        });
        midPanelBackground.addChild(lbDescription);

        // top panel
        let topPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 0, 453, 196.5));
        topPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4 + midPanelBackground.height * midPanelBackground.scale,
            scale: cf.WIDTH * 0.9 / topPanelBackground.width,
        });
        this.addChild(topPanelBackground);

        let closeBtn = new ccui.Button(asset.panelBtnClose_png);
        closeBtn.attr({
            x: topPanelBackground.width * 0.935,
            y: topPanelBackground.height * 0.865,
            scale: topPanelBackground.width * 0.07 / closeBtn.width,
        });
        closeBtn.addClickEventListener(() => {
            this.destroy();
        });
        topPanelBackground.addChild(closeBtn, 0);

        this.miniatureGlow = cc.Sprite(asset.cardPanelMiniatureGlows_png[card.rarity]);
        this.miniatureGlow.attr({
            x: cf.WIDTH / 2,
            y: topPanelBackground.y + topPanelBackground.height * topPanelBackground.scale * 0.75,
            scale: cf.WIDTH * 0.5 / this.miniatureGlow.width,
            opacity: 127,
        });
        this.addChild(this.miniatureGlow);

        if (card.isMonster()) {
            this.miniature = cc.Sprite(card.miniature);
            this.miniature.attr({
                x: cf.WIDTH / 2,
                y: topPanelBackground.y + topPanelBackground.height * topPanelBackground.scale * 0.75,
                scale: cf.WIDTH * 0.25 / this.miniature.width,
            });
            this.addChild(this.miniature);
        } else if (card.isTower()) {
            this.miniature = cc.Sprite(card.miniature[card.evolution]);
            this.miniature.attr({
                x: cf.WIDTH / 2,
                y: topPanelBackground.y + topPanelBackground.height * topPanelBackground.scale * 0.75,
                scale: cf.WIDTH * 0.25 / this.miniature.width,
            });
            this.addChild(this.miniature);
        }

        // bottom panel
        let botPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 294.75, 453, 98.25));
        botPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4 - midPanelBackground.height * midPanelBackground.scale * 0.75,
            scale: cf.WIDTH * 0.9 / botPanelBackground.width,
        });
        this.addChild(botPanelBackground);

        let botBtnX = [undefined, undefined, undefined], counter = 0;
        if (!card.isInDeck()) {
            botBtnX[0] = 1;
            counter++;
        }
        if (card.level < 10) {
            botBtnX[1] = 1;
            counter++;
        }
        if (card.isTower()) {
            botBtnX[2] = 1;
            counter++;
        }
        let j = 0;
        for (let i = 0; i < counter; i++) {
            while (botBtnX[j] === undefined) j++;
            botBtnX[j] = botPanelBackground.width * 1.2 * (i + 1) / (counter + 1) - botPanelBackground.width * (1.2 - 1) / 2;
            j++;
        }

        if (!card.isInDeck()) {
            let chooseBtn = new ccui.Button(asset.btnBlue_png);
            chooseBtn.setZoomScale(0);
            chooseBtn.addClickEventListener(() => {
                let cardsUI = this.parent.tabUIs[cf.LOBBY_TAB_CARDS];
                this.destroy();
                cardsUI.showAddCardToDeck(card);
            });
            chooseBtn.attr({
                x: botBtnX[0],
                y: botPanelBackground.height * 0.6,
                scale: botPanelBackground.height * 0.7 / chooseBtn.height,
            });
            botPanelBackground.addChild(chooseBtn);

            let lb = new ccui.Text('Chọn', asset.svnSupercellMagic_ttf, 24);
            lb.enableShadow();
            lb.attr({
                x: chooseBtn.width / 2,
                y: chooseBtn.height / 2,
            });
            chooseBtn.addChild(lb);
        }
        if (card.level < 10) {
            let upgradeBtn;
            if (card.fragment < card.reqFrag) {
                upgradeBtn = new ccui.Button(asset.btnGray_png);
                upgradeBtn.addClickEventListener(() => {
                    Utils.addToastToRunningScene('Bạn không đủ thẻ nâng cấp');
                });
            } else {
                upgradeBtn = new ccui.Button(asset.btnGreen_png);
                if (sharePlayerInfo.gold < card.reqGold) {
                    upgradeBtn.addClickEventListener(() => {
                        Utils.addToastToRunningScene('Bạn không đủ vàng nâng cấp');
                    });
                } else {
                    upgradeBtn.addClickEventListener(() => {
                        testnetwork.connector.sendUpgradeCardRequest(card.type, card.reqGold);
                    });
                }
            }
            upgradeBtn.setZoomScale(0);
            upgradeBtn.attr({
                x: botBtnX[1],
                y: botPanelBackground.height * 0.6,
                scale: botPanelBackground.height * 0.7 / upgradeBtn.height,
            });
            botPanelBackground.addChild(upgradeBtn);

            let lbTop = new ccui.Text('Nâng cấp', asset.svnSupercellMagic_ttf, 22);
            lbTop.enableShadow();
            lbTop.attr({
                x: upgradeBtn.width / 2,
                y: upgradeBtn.height * 0.7,
            });
            upgradeBtn.addChild(lbTop);

            let iconGold = new cc.Sprite(asset.iconGold_png);
            iconGold.attr({
                x: upgradeBtn.width * 0.3,
                y: upgradeBtn.height * 0.35,
                scale: upgradeBtn.height * 0.3 / iconGold.height,
            });
            upgradeBtn.addChild(iconGold);

            let lbBot = new ccui.Text(card.reqGold.toString(), asset.svnSupercellMagic_ttf, 22);
            lbBot.enableShadow();
            lbBot.attr({
                x: upgradeBtn.width * 0.6,
                y: upgradeBtn.height * 0.38,
                color: sharePlayerInfo.gold < card.reqGold ? cc.color(255, 64, 64) : cc.color(255, 255, 255),
            });
            upgradeBtn.addChild(lbBot);
        }
        if (card.isTower()) {
            let showSkillBtn = new ccui.Button(asset.btnOrange_png);
            showSkillBtn.setZoomScale(0);
            showSkillBtn.attr({
                x: botBtnX[2],
                y: botPanelBackground.height * 0.6,
                scale: botPanelBackground.height * 0.7 / showSkillBtn.height,
            });
            botPanelBackground.addChild(showSkillBtn);

            let lb = new ccui.Text('Kỹ Năng', asset.svnSupercellMagic_ttf, 24);
            lb.enableShadow();
            lb.attr({
                x: showSkillBtn.width / 2,
                y: showSkillBtn.height / 2,
            });
            showSkillBtn.addChild(lb);
        }

        this.addTouchListener(topPanelBackground, botPanelBackground);
    },

    destroy: function () {
        this.visible = false;
        this.parent.removeCardInfoUI(this);
    },

    addTouchListener: function (top, bot) {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: (event) => {
                let locationY = event.getLocation().y;
                if (locationY > top.y + top.height / 2 * top.scale ||
                    locationY < bot.y - bot.height / 2 * bot.scale) {
                    this.readyToDestroy = true;
                    return true;
                }
                return false;
            },
            onTouchEnded: () => {
                if (this.readyToDestroy) {
                    this.destroy();
                    return true;
                }
                return false;
            },
        }, this);
    },
});
