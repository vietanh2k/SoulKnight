// if inDeck is true:
// this.parent: DeckPanel
// this.parent.parent: CardsUI
// this.parent.parent.parent: LobbyScene
// if inDeck is false:
// this.parent: CardsUI
// this.parent.parent: LobbyScene
var CardSlot = ccui.Button.extend({
    card: null,
    inDeck: null,
    texture: null,
    levelPanel: null,
    lbLevel: null,
    border: null,
    iconEnergy: null,
    lbEnergy: null,
    progressPanel: null,
    progress: null,
    progressGlow: null,

    ctor: function (card, inDeck) {
        this.card = card;
        this._super(asset.cardBackgrounds_png[card.rarity]);
        this.setZoomScale(0);
        this.setSwallowTouches(false);

        this.inDeck = inDeck;
        this.updateClickEventListener();

        this.texture = new cc.Sprite(card.texture);
        this.texture.attr({
            x: this.width / 2,
            y: this.height / 2,
            scaleX: this.width / this.texture.width,
            scaleY: this.height / this.texture.height,
        })
        this.addChild(this.texture);

        this.levelPanel = new cc.Sprite(asset.cardLevel_png);
        this.levelPanel.attr({
            anchorY: 0,
            x: this.width / 2,
            y: this.height * 0.07,
            scale: this.width / this.levelPanel.width,
        })
        this.addChild(this.levelPanel);

        this.lbLevel = new ccui.Text('Lv. ' + card.level, asset.svnSupercellMagic_ttf, 16);
        this.lbLevel.attr({
            x: this.levelPanel.width / 2,
            y: this.levelPanel.height / 2,
        })
        this.lbLevel.enableShadow();
        this.levelPanel.addChild(this.lbLevel, 0);

        this.border = new cc.Sprite(asset.cardBorders_png[card.rarity]);
        this.border.attr({
            x: this.width / 2,
            y: this.height / 2,
            scaleX: this.width * 1.05 / this.border.width,
            scaleY: this.height * 1.05 / this.border.height,
        })
        this.addChild(this.border);

        this.iconEnergy = new cc.Sprite(asset.iconEnergy_png);
        this.iconEnergy.attr({
            x: this.width * 0.05,
            y: this.height * 0.95,
            scale: this.width * 0.45 / this.iconEnergy.width,
        })
        this.addChild(this.iconEnergy);

        this.lbEnergy = new ccui.Text(card.energy, asset.svnSupercellMagic_ttf, 18);
        this.lbEnergy.attr({
            x: this.iconEnergy.width / 2,
            y: this.iconEnergy.height / 2,
        })
        this.lbEnergy.enableOutline(cc.color(0, 0, 0));
        this.iconEnergy.addChild(this.lbEnergy);

        if (this.inDeck) {
            this.progressPanel = new cc.Sprite(asset.progressBackgroundDeck_png);
        } else {
            this.progressPanel = new cc.Sprite(asset.progressBackground_png);
        }
        this.progressPanel.attr({
            x: this.width / 2,
            y: this.height * -0.12,
            scale: this.width / this.progressPanel.width,
        })
        this.addChild(this.progressPanel);

        let ratio;
        if (card.reqFrag === 0) ratio = 1;
        else ratio = card.fragment / card.reqFrag;
        if (ratio > 1) ratio = 1;
        if (ratio === 1) {
            this.progress = new sp.SkeletonAnimation(asset.cardUpgradeReady_json, asset.cardUpgradeReady_atlas);
            this.progress.setAnimation(0, 'card_upgrade_ready', true);
            this.progress.attr({
                x: this.progressPanel.width / 2,
                y: this.progressPanel.height / 2,
            });
            this.progressPanel.addChild(this.progress);
        } else {
            this.progress = new cc.Sprite(asset.progress_png);
            this.progressGlow = new cc.Sprite(asset.progressGlow_png);
            this.progressGlow.attr({
                x: this.progress.width / 2,
                y: this.progress.height / 2,
                scaleX: this.progress.width / this.progressGlow.width,
                scaleY: this.progress.height / this.progressGlow.height,
            });
            this.progress.addChild(this.progressGlow);
            this.progress.attr({
                x: this.progressPanel.width / 2 * ratio,
                y: this.progressPanel.height / 2,
                scaleX: this.progressPanel.width * 0.95 * ratio / this.progress.getBoundingBox().width,
                scaleY: this.progressPanel.height * 0.8 / this.progress.getBoundingBox().height,
            });
            this.progressPanel.addChild(this.progress);
        }

        if (card.reqFrag === 0) {
            this.lbFragment = new ccui.Text('MAX', asset.svnSupercellMagic_ttf, 16);
        } else {
            this.lbFragment = new ccui.Text('' + card.fragment + '/' + card.reqFrag, asset.svnSupercellMagic_ttf, 16);
        }
        this.lbFragment.attr({
            x: this.progressPanel.width / 2,
            y: this.progressPanel.height / 2 * 1.1,
        })
        this.lbFragment.enableShadow();
        this.progressPanel.addChild(this.lbFragment);

        this.rarityParticle = new cc.ParticleSystem(asset.miniatureRaritiesParticle_plist[card.rarity]);
        this.rarityParticle.attr({
            x: this.width / 2,
            y: this.height / 2,
            scale: 1,
        });
        this.addChild(this.rarityParticle);
    },

    updateClickEventListener: function () {
        if (this.inDeck) {
            this.addClickEventListener(() => {
                if (!this.parent.parent.isScrolling) {
                    if (this.parent.parent.parent.allBtnIsActive) {
                        this.parent.parent.parent.addChild(new CardInfoUI(this.card), 4);
                        this.parent.parent.parent.allBtnIsActive = false;
                    } else if (this.parent.parent.isShowingAddCardToDeck) {
                        let i;
                        for (i = 0; i < sharePlayerInfo.deck.length; i++) {
                            if (sharePlayerInfo.deck[i].id === this.card.id) {
                                sharePlayerInfo.deck[i] = sharePlayerInfo.collection.find(element => element.id === this.parent.parent.pendingCardId);
                                break;
                            }
                        }
                        this.parent.parent.updateDeckSlot(i);
                    } else {
                        cc.log('allBtnIsActive is false and CardsUI is not showing add card to deck');
                    }
                }
            });
        } else {
            this.addClickEventListener(() => {
                if (!this.parent.isScrolling) {
                    if (this.parent.parent.allBtnIsActive) {
                        this.parent.parent.addChild(new CardInfoUI(this.card), 4);
                        this.parent.parent.allBtnIsActive = false;
                    } else {
                        cc.log('allBtnIsActive is false');
                    }
                }
            });
        }
    },
});
