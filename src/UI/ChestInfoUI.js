// this.parent: LobbyScene
var ChestInfoUI = cc.Layer.extend({

    ctor: function (chest, openingChestCounter, slot) {
        this._super();

        let layerColor = new cc.LayerColor(cc.color(0, 0, 0), CFG.WIDTH, CFG.HEIGHT);
        layerColor.setOpacity(150);
        this.addChild(layerColor);

        let panelBackground = new cc.Sprite(asset.panelBackground_png);
        panelBackground.attr({
            x: CFG.WIDTH / 2,
            y: CFG.HEIGHT * 0.4,
            scale: CFG.WIDTH * 0.9 / panelBackground.width,
        })
        this.addChild(panelBackground);

        let closeBtn = new ccui.Button(asset.panelBtnClose_png);
        closeBtn.attr({
            x: panelBackground.width * 0.93,
            y: panelBackground.height * 0.93,
            scale: panelBackground.width * 0.07 / closeBtn.width,
        })
        closeBtn.addClickEventListener(() => {
            this.destroy();
        });
        panelBackground.addChild(closeBtn, 0);

        let pedestal = new cc.Sprite(asset.treasurePedestal_png);
        pedestal.attr({
            x: panelBackground.width / 2,
            y: panelBackground.height,
            scale: panelBackground.width * 0.5 / pedestal.width,
        });
        panelBackground.addChild(pedestal, 0);

        let iconChest = new cc.Sprite(asset.commonTreasure_png);
        iconChest.attr({
            x: pedestal.width / 2,
            y: pedestal.height,
            scale: pedestal.width * 0.7 / iconChest.width,
        });
        pedestal.addChild(iconChest, 0);

        let panelFrontTop = new cc.Sprite(asset.panelFront_png, cc.rect(0, 0, 424, 100));
        panelFrontTop.attr({
            anchorY: 0,
            x: panelBackground.width / 2,
            y: panelBackground.height * 0.45,
            scale: panelBackground.width * 0.95 / panelFrontTop.width,
        });
        panelBackground.addChild(panelFrontTop, 0);

        let panelFrontBottom = new cc.Sprite(asset.panelFront_png, cc.rect(0, 262, 424, 80));
        panelFrontBottom.attr({
            anchorY: 1,
            x: panelBackground.width / 2,
            y: panelBackground.height * 0.45,
            scale: panelBackground.width * 0.95 / panelFrontBottom.width,
        });
        panelBackground.addChild(panelFrontBottom, 0);

        let leftBox = new cc.Sprite(asset.lobbyBox_png);
        leftBox.attr({
            x: panelFrontTop.width * 0.28,
            y: panelFrontTop.height * 0.5,
            scale: panelFrontTop.width * 0.35 / leftBox.width,
        })
        panelFrontTop.addChild(leftBox, 0);

        let rightBox = new cc.Sprite(asset.lobbyBox_png);
        rightBox.attr({
            x: panelFrontTop.width * 0.72,
            y: panelFrontTop.height * 0.5,
            scale: panelFrontTop.width * 0.35 / rightBox.width,
        })
        panelFrontTop.addChild(rightBox, 0);

        let lbGold = new ccui.Text('Vàng', asset.svnSupercellMagic_ttf, 12);
        lbGold.attr({
            anchorX: 0,
            x: leftBox.width * 0.15,
            y: leftBox.height,
        })
        lbGold.enableShadow();
        leftBox.addChild(lbGold, 0);

        let lbCard = new ccui.Text('Thẻ', asset.svnSupercellMagic_ttf, 12);
        lbCard.attr({
            anchorX: 0,
            x: rightBox.width * 0.15,
            y: rightBox.height,
        })
        lbCard.enableShadow();
        rightBox.addChild(lbCard, 0);

        let iconGold = new cc.Sprite(asset.iconGold_png);
        iconGold.attr({
            y: leftBox.height / 2,
            scale: leftBox.height * 1.1 / iconGold.height,
        });
        leftBox.addChild(iconGold, 0);

        let iconCard = new cc.Sprite(asset.iconCardsMultiple_png[0]);
        iconCard.attr({
            y: rightBox.height / 2,
            scale: rightBox.height * 1.1 / iconCard.height,
        });
        rightBox.addChild(iconCard, 0);

        let lbGoldAmount = new ccui.Text(this.readableGoldRange(chest.golds), asset.svnSupercellMagic_ttf, 14);
        lbGoldAmount.attr({
            anchorX: 0,
            x: leftBox.width * 0.15,
            y: leftBox.height * 0.45,
            color: cc.color(255, 203, 66),
        });
        lbGoldAmount.enableShadow();
        leftBox.addChild(lbGoldAmount, 0);

        let lbCardAmount = new ccui.Text(this.readableGoldRange(chest.cards), asset.svnSupercellMagic_ttf, 14);
        lbCardAmount.attr({
            anchorX: 0,
            x: rightBox.width * 0.15,
            y: rightBox.height * 0.45,
            color: cc.color(92, 187, 255),
        });
        lbCardAmount.enableShadow();
        rightBox.addChild(lbCardAmount, 0);

        let lbRarities = new ccui.Text('Loại thẻ:', asset.svnAvoBold_ttf, 20);
        lbRarities.attr({
            x: panelFrontBottom.width * 0.25,
            y: panelFrontBottom.height * 0.7,
            color: cc.color(101, 75, 59),
        });
        panelFrontBottom.addChild(lbRarities, 0);

        for (let i = 0; i < chest.rarities.length; i++) {
            let rarity = new cc.Sprite(asset.iconCardsMultiple_png[chest.rarities[i]]);
            rarity.attr({
                x: panelFrontBottom.width * (0.45 + 0.1 * i),
                y: panelFrontBottom.height * 0.7,
                scale: panelFrontBottom.height * 0.4 / rarity.height,
            });
            panelFrontBottom.addChild(rarity, 0);
        }

        let openByGemBtnX = panelBackground.width / 2;
        if (openingChestCounter === 0) {
            openByGemBtnX = panelBackground.width * 0.65;
            let openByGoldBtn = new ccui.Button(asset.btnOrange_png);
            openByGoldBtn.attr({
                x: panelBackground.width * 0.35,
                y: panelBackground.height * 0.15,
                scale: panelBackground.width * 0.25 / openByGoldBtn.width,
            });
            let lbGoldBtn = new ccui.Text('Mở Rương', asset.svnSupercellMagic_ttf, 18);
            lbGoldBtn.attr({
                x: openByGoldBtn.width / 2,
                y: openByGoldBtn.height / 2,
            })
            lbGoldBtn.enableShadow();
            openByGoldBtn.addChild(lbGoldBtn, 0);
            openByGoldBtn.addClickEventListener(() => {
                this.parent.tabUIs[CFG.LOBBY_TAB_HOME].sendRequestStartCooldownChestSlot(slot);
                this.destroy();
            });
            panelBackground.addChild(openByGoldBtn, 0);
        }
        let openByGemBtn = new ccui.Button(asset.btnGreen_png);
        openByGemBtn.attr({
            x: openByGemBtnX,
            y: panelBackground.height * 0.15,
            scale: panelBackground.width * 0.25 / openByGemBtn.width,
        });
        let lbGemBtn = new ccui.Text('Mở Rương', asset.svnSupercellMagic_ttf, 18);
        lbGemBtn.attr({
            x: openByGemBtn.width / 2,
            y: openByGemBtn.height * 0.7,
        })
        lbGemBtn.enableShadow();
        openByGemBtn.addChild(lbGemBtn, 0);
        let iconGem = new cc.Sprite(asset.iconGem_png);
        iconGem.attr({
            x: openByGemBtn.width * 0.4,
            y: openByGemBtn.height * 0.35,
            scale: openByGemBtn.height * 0.35 / iconGem.height,
        })
        let openTimePassed = 0;
        if (chest.openTimeStarted !== null) {
            openTimePassed = Date.now() - chest.openTimeStarted;
        }
        openByGemBtn.addChild(iconGem, 0);
        let lbGemAmount = new ccui.Text(Utils.gemCostToOpenChest(chest.openTimeRequired - openTimePassed), asset.svnSupercellMagic_ttf, 18);
        lbGemAmount.attr({
            x: openByGemBtn.width * 0.6,
            y: openByGemBtn.height * 0.35,
        })
        lbGemAmount.enableShadow();
        openByGemBtn.addChild(lbGemAmount);
        openByGemBtn.addClickEventListener(() => {
            this.parent.tabUIs[CFG.LOBBY_TAB_HOME].sendRequestOpenChestSlot(slot);
            this.destroy();
        });
        panelBackground.addChild(openByGemBtn, 0);
    },

    destroy: function () {
        this.visible = false;
        this.parent.allBtnIsActive = true;
        this.removeFromParent();
    },

    readableGoldRange: function (golds) {
        return '' + golds[0] + ' - ' + golds[1];
    },

    readableCardRange: function (cards) {
        return 'x' + cards[0] + ' - ' + cards[1];
    },
});
