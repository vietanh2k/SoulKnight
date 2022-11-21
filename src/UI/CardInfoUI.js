// this.parent: LobbyScene
var CardInfoUI = cc.Layer.extend({
    card: null,

    ctor: function (card) {
        this._super();

        this.card = card;

        let layerColor = new cc.LayerColor(cc.color(0, 0, 0), cf.WIDTH, cf.HEIGHT);
        layerColor.attr({
            opacity: 150,
            scale: 10,
        });
        this.addChild(layerColor);

        // middle panel
        this.midPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 98.25, 453, 196.5));
        this.midPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4,
            scale: cf.WIDTH * 0.9 / this.midPanelBackground.width,
        });
        this.addChild(this.midPanelBackground);

        this.topDescriptionPanel = cc.Sprite(asset.panelFront_png, cc.rect(0, 0, 424, 114));
        this.topDescriptionPanel.attr({
            anchorY: 0,
            x: this.midPanelBackground.width / 2,
            y: this.midPanelBackground.height / 2,
            scale: this.midPanelBackground.height * 0.5 / this.topDescriptionPanel.height,
        });
        this.midPanelBackground.addChild(this.topDescriptionPanel, 1);

        let botDescriptionPanel = cc.Sprite(asset.panelFront_png, cc.rect(0, 228, 424, 114));
        botDescriptionPanel.attr({
            anchorY: 1,
            x: this.midPanelBackground.width / 2,
            y: this.midPanelBackground.height / 2,
            scale: this.midPanelBackground.height * 0.5 / botDescriptionPanel.height,
        });
        this.midPanelBackground.addChild(botDescriptionPanel);

        this.initAttributeSlots();

        // top panel
        let topPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 0, 453, 196.5));
        topPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4 + this.midPanelBackground.height * this.midPanelBackground.scale,
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
            this.destroy(false);
        });
        topPanelBackground.addChild(closeBtn, 0);

        if (!this.card.isSpell()) {
            this.miniatureGlow = cc.Sprite(asset.cardPanelMiniatureGlows_png[card.rarity]);
            this.miniatureGlow.attr({
                x: cf.WIDTH / 2,
                y: topPanelBackground.y + topPanelBackground.height * topPanelBackground.scale * 0.75,
                scale: cf.WIDTH * 0.5 / this.miniatureGlow.width,
                opacity: 127,
            });
            this.addChild(this.miniatureGlow);
        }

        let cardSlot = new CardSlot(card, false);
        cardSlot.addClickEventListener(() => {});
        cardSlot.attr({
            x: this.topDescriptionPanel.width * 0.2,
            y: this.topDescriptionPanel.height * 0.85,
            scale: this.topDescriptionPanel.height * 1.1 / cardSlot.height,
        });
        topPanelBackground.addChild(cardSlot);

        let lbCardName = new ccui.Text(card.name, asset.svnSupercellMagic_ttf, 20);
        lbCardName.enableOutline(cc.color(0, 0, 0));
        lbCardName.enableShadow(cc.color(0, 0, 0), cc.size(0, -1));
        lbCardName.attr({
            x: this.topDescriptionPanel.width * 0.675,
            y: this.topDescriptionPanel.height * 1.2,
        });
        topPanelBackground.addChild(lbCardName);

        let lbLevel = new ccui.Text('Cấp ' + card.level, asset.svnSupercellMagic_ttf, 20);
        lbLevel.enableOutline(cc.color(0, 0, 0));
        lbLevel.enableShadow(cc.color(0, 0, 0), cc.size(0, -1));
        lbLevel.attr({
            x: this.topDescriptionPanel.width * 0.675,
            y: this.topDescriptionPanel.height * 0.95,
            color: cc.color(255, 255, 50),
        });
        topPanelBackground.addChild(lbLevel);

        let rarityBox = new cc.Sprite(asset.cardPanelBox_png);
        rarityBox.attr({
            x: this.topDescriptionPanel.width * 0.5,
            y: this.topDescriptionPanel.height * 0.42,
            scale: cf.WIDTH * 0.18 / rarityBox.width,
        });
        topPanelBackground.addChild(rarityBox);
        let lbRarityBox = new ccui.Text(cf.TEXT_RARITIES[card.rarity], asset.svnSupercellMagic_ttf, 17);
        lbRarityBox.attr({
            x: rarityBox.width / 2,
            y: rarityBox.height * 0.45,
            color: cf.COLOR_RARITIES[card.rarity],
        });
        rarityBox.addChild(lbRarityBox);

        let rarityFlag = new cc.Sprite(asset.cardPanelFlags_png[card.rarity]);
        rarityFlag.attr({
            x: this.topDescriptionPanel.width * 0.5,
            y: this.topDescriptionPanel.height * 0.65,
            scale: cf.WIDTH * 0.2 / rarityFlag.width,
        });
        topPanelBackground.addChild(rarityFlag);
        let lbRarityFlag = new ccui.Text('Độ Hiếm', asset.svnSupercellMagic_ttf, 17);
        lbRarityFlag.attr({
            x: rarityFlag.width / 2,
            y: rarityFlag.height * 0.55,
            color: cc.color(0, 0, 0),
            opacity: 127,
        });
        rarityFlag.addChild(lbRarityFlag);

        let typeBox = new cc.Sprite(asset.cardPanelBox_png);
        typeBox.attr({
            x: this.topDescriptionPanel.width * 0.85,
            y: this.topDescriptionPanel.height * 0.42,
            scale: cf.WIDTH * 0.18 / typeBox.width,
        });
        topPanelBackground.addChild(typeBox);
        let lbTypeBox = new ccui.Text(this.card.getTextType(), asset.svnSupercellMagic_ttf, 17);
        lbTypeBox.attr({
            x: rarityBox.width / 2,
            y: rarityBox.height * 0.45,
            color: cf.COLOR_RARITIES[2],
        });
        typeBox.addChild(lbTypeBox);

        let typeFlag = new cc.Sprite(asset.cardPanelFlags_png[2]);
        typeFlag.attr({
            x: this.topDescriptionPanel.width * 0.85,
            y: this.topDescriptionPanel.height * 0.65,
            scale: cf.WIDTH * 0.2 / typeFlag.width,
        });
        topPanelBackground.addChild(typeFlag);
        let lbTypeFlag = new ccui.Text('Loại', asset.svnSupercellMagic_ttf, 17);
        lbTypeFlag.attr({
            x: typeFlag.width / 2,
            y: typeFlag.height * 0.55,
            color: cc.color(0, 0, 0),
            opacity: 127,
        });
        typeFlag.addChild(lbTypeFlag);

        if (card.isMonster()) {
            this.miniature = cc.Sprite(card.miniature);
            this.miniature.attr({
                x: cf.WIDTH * 0.5,
                y: topPanelBackground.y + topPanelBackground.height * topPanelBackground.scale * 0.75,
                scale: cf.WIDTH * 0.3 / this.miniature.width,
            });
            this.addChild(this.miniature);
        } else if (card.isTower()) {
            this.miniature = cc.Sprite(card.miniature[card.evolution]);
            this.miniature.attr({
                x: cf.WIDTH / 2,
                y: topPanelBackground.y + topPanelBackground.height * topPanelBackground.scale * 0.75,
                scale: cf.WIDTH * 0.3 / this.miniature.width,
            });
            this.addChild(this.miniature);
        }

        // bottom panel
        let botPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 294.75, 453, 98.25));
        botPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4 - this.midPanelBackground.height * this.midPanelBackground.scale * 0.75,
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
                this.destroy(true);
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

        // fixme sửa lại hàm dưới khi có Node mới có y lớn hơn topPanelBackground
        this.addTouchListener(topPanelBackground, botPanelBackground);

        Utils.addScaleAnimation(this);
    },

    destroy: function (isShowingAddCardToDeck) {
        this.visible = false;
        this.parent.removeCardInfoUI(this, !isShowingAddCardToDeck);
    },

    initAttributeSlots: function () {
        this.statSlots = [];
        if (this.card.isMonster()) {
            this.addAttributeSlotToPanel(this.card, 'hp', 0);
            this.addAttributeSlotToPanel(this.card, 'speed', 1);
            this.addAttributeSlotToPanel(this.card, 'numberMonsters', 2);
        } else if (this.card.isTower()) {
            switch (this.card.id) {
                case 100: case 101: case 102:
                    this.addAttributeSlotToPanel(this.card, 'damage', 0);
                    this.addAttributeSlotToPanel(this.card, 'attackSpeed', 1);
                    this.addAttributeSlotToPanel(this.card, 'range', 2);
                    this.addAttributeSlotToPanel(this.card, 'bulletType', 3);
                    break;
                case 103: case 104:
                    this.addAttributeSlotToPanel(this.card, 'bulletTargetBuffType', 0);
                    this.addAttributeSlotToPanel(this.card, 'attackSpeed', 1);
                    this.addAttributeSlotToPanel(this.card, 'range', 2);
                    this.addAttributeSlotToPanel(this.card, 'bulletType', 3);
                    break;
                case 105: case 106:
                    this.addAttributeSlotToPanel(this.card, 'auraTowerBuffType', 0);
                    break;
                default:
                    cc.log('Cannot find card id ' + this.card.id);
                    break;
            }
        } else if (this.card.isSpell()) {
            cc.log('Spell does not have config yet!');
        } else {
            cc.log('神樱神游神乐舞');
        }
    },

    addAttributeSlotToPanel: function (card, attribute, index) {
        let texture, textAttribute, textStat, textUpgradeStat;
        switch (attribute) {
            case 'hp':
                textAttribute = 'Máu:';
                texture = asset.statIcons_png['hp'];
                textStat = card.monsterInfo.hp;
                textUpgradeStat = undefined;
                break;
            case 'speed':
                textAttribute = 'Tốc chạy:';
                texture = asset.statIcons_png['speed'];
                textStat = card.monsterInfo.speed;
                textUpgradeStat = undefined;
                break;
            case 'numberMonsters':
                textAttribute = 'Số lượng:';
                texture = asset.statIcons_png['numberMonsters'];
                if (card.monsterInfo.numberMonsters === 1) {
                    textStat = '1';
                } else {
                    textStat = '1 - ' + card.monsterInfo.numberMonsters;
                }
                textUpgradeStat = undefined;
                break;
                // todo more cases
            default:
                cc.log('Cannot find case!');
                break;
        }
        let row = Math.floor(index / 2);
        let column = index - row * 2;
        let slotWidth = this.topDescriptionPanel.width / (2 + 3 * 0.15);
        let spaceBetween = slotWidth * 0.15;
        let statSlotX = spaceBetween * (column + 1) + slotWidth * (column + 0.5);
        let statSlotY = this.topDescriptionPanel.height * (0.6 - 0.5 * row);
        let newStatSlot = new StatSlot(texture, textAttribute, textStat, textUpgradeStat);
        newStatSlot.attr({
            x: statSlotX,
            y: statSlotY,
            scale: slotWidth / newStatSlot.width,
        });
        this.topDescriptionPanel.addChild(newStatSlot);
        this.statSlots[index] = newStatSlot;
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
                    this.destroy(false);
                    return true;
                }
                return false;
            },
        }, this);
    },
});
