// this.parent: LobbyScene
var CardsUI = cc.Layer.extend({
    currentScroll: 0,
    lowerbound: 0,
    upperbound: 0,
    scrollTouching: false,

    deckPanel: null,
    lbDeck: null,
    deckSlots: null,
    collectionPanel: null,
    lbCollection: null,
    collectionSlots: null,

    sortByEnergyBtn: null,
    sortByEnergyAsc: null,

    isShowingAddCardToDeck: false,
    isScrolling: false,
    DISTANCE_SCROLL_ACCEPT: 5,

    ctor: function () {
        this._super();

        this.isShowingAddCardToDeck = false;
        this.isScrolling = false;

        this.initDeckPanel();
        this.initCollection();

        this.addVerticalScrollByTouchListener();
    },

    initDeckPanel: function () {
        this.deckPanel = new cc.Sprite(asset.deckPanel_png);
        this.deckPanel.attr({
            anchorY: 1,
            x: cf.WIDTH / 2,
            y: cf.HEIGHT - cf.WIDTH / 854 * 85,
            scale: cf.WIDTH / this.deckPanel.width,
        });
        this.addChild(this.deckPanel);

        this.lbDeck = new ccui.Text('BỘ BÀI CHIẾN ĐẤU', asset.svnSupercellMagic_ttf, 22);
        this.lbDeck.attr({
            x: this.deckPanel.width / 3,
            y: this.deckPanel.height * 0.93,
            color: cc.color(253, 251, 156),
        });
        this.lbDeck.enableShadow();
        this.deckPanel.addChild(this.lbDeck);

        this.deckSlots = [];
        for (let i = 0; i < sharePlayerInfo.deck.length; i++) {
            let card = sharePlayerInfo.deck[i];
            this.addCardSlotToDeckPanel(card, i);
        }
    },

    addCardSlotToDeckPanel: function (card, index) {
        let row = Math.floor(index / 4);
        let column = index - row * 4;
        let slotWidth = this.deckPanel.width / (4 + 5 * 0.3);
        let spaceBetween = slotWidth * 0.3;
        let cardSlotX = spaceBetween * (column + 1) + slotWidth * (column + 0.5);
        let cardSlotY = this.deckPanel.height * (0.7 - 0.37 * row);
        let newCardSlot = new CardSlot(card, true);
        newCardSlot.attr({
            x: cardSlotX,
            y: cardSlotY,
            scale: slotWidth / newCardSlot.width,
        });
        this.deckPanel.addChild(newCardSlot);
        this.deckSlots[index] = newCardSlot;
    },

    initCollection: function () {
        if (this.collectionPanel == null) {
            this.collectionPanel = new cc.Sprite(asset.cardBanner_png);
            this.collectionPanel.attr({
                anchorY: 1,
                x: cf.WIDTH / 2,
                y: cf.HEIGHT - cf.WIDTH / 854 * 85 - cf.WIDTH / 682 * 604,
                scale: cf.WIDTH / this.collectionPanel.width * (4 + 3 * 0.3) / (4 + 5 * 0.3),
            })
            this.addChild(this.collectionPanel);

            this.lbCollection = new ccui.Text('BỘ SƯU TẬP THẺ BÀI', asset.svnSupercellMagic_ttf, 20);
            this.lbCollection.attr({
                x: this.collectionPanel.width * 0.3,
                y: this.collectionPanel.height * 0.65,
                color: cc.color(172, 206, 235),
            });
            this.lbCollection.enableShadow();
            this.collectionPanel.addChild(this.lbCollection);

            this.sortByEnergyBtn = new ccui.Button(asset.iconEnergy_png);
            this.sortByEnergyBtn.attr({
                x: this.collectionPanel.width * 0.92,
                y: this.collectionPanel.height / 2,
                scale: this.collectionPanel.height * 0.6 / this.sortByEnergyBtn.height,
            });
            this.sortByEnergyBtn.addClickEventListener(() => {
                if (this.sortByEnergyAsc == null) {
                    this.sortByEnergyAsc = false;
                    this.sortArrow.visible = true;
                } else {
                    this.sortByEnergyAsc = !this.sortByEnergyAsc;
                    this.sortArrow.flippedY = this.sortByEnergyAsc;
                }
                this.sortCollectionSlotsByEnergy();
            });
            this.collectionPanel.addChild(this.sortByEnergyBtn);

            this.sortArrow = new cc.Sprite(asset.cardSwitchArrow_png);
            this.sortArrow.attr({
                x: this.collectionPanel.width * 0.82,
                y: this.collectionPanel.height / 2,
                scale: 1,
            });
            this.sortArrow.visible = false;
            this.collectionPanel.addChild(this.sortArrow);
        }

        this.collectionSlots = [];
        for (let i = 0; i < sharePlayerInfo.collection.length; i++) {
            let card = sharePlayerInfo.collection[i];
            if (!card.isInDeck()) {
                this.addCardSlotToCollection(card, this.findEmptySlotInCollectionSlots());
            }
        }
    },

    findEmptySlotInCollectionSlots: function () {
        let i = 0;
        while (this.collectionSlots[i] !== undefined) {
            i++;
        }
        return i;
    },

    addCardSlotToCollection: function (card, index) {
        let row = Math.floor(index / 4);
        let column = index - row * 4;
        let slotWidth = cf.WIDTH / (4 + 5 * 0.3);
        let spaceBetween = slotWidth * 0.3;
        let cardSlotX = spaceBetween * (column + 1) + slotWidth * (column + 0.5);
        let cardSlotY = this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * (1.32 + 0.38 * row);
        let newCardSlot = new CardSlot(card, false);
        newCardSlot.attr({
            x: cardSlotX,
            y: cardSlotY,
            scale: slotWidth / newCardSlot.width,
        });
        this.addChild(newCardSlot);
        this.collectionSlots[index] = newCardSlot;
        if (index === sharePlayerInfo.collection.length - 1) {
            this.setUpperboundBasedOnTheLowestItem(cardSlotY);
        }
    },

    sortCollectionSlotsByEnergy: function () {
        for (let i = 0; i < this.collectionSlots.length; i++) {
            this.collectionSlots[i].removeFromParent(true);
            this.collectionSlots[i] = undefined;
        }
        sharePlayerInfo.sortCollectionByEnergy(this.sortByEnergyAsc);

        for (let i = 0; i < sharePlayerInfo.collection.length; i++) {
            let card = sharePlayerInfo.collection[i];
            if (!card.isInDeck()) {
                this.addCardSlotToCollection(card, this.findEmptySlotInCollectionSlots());
            }
        }
    },

    showAddCardToDeck: function (card) {
        this.parent.allBtnIsActive = false;
        this.isShowingAddCardToDeck = true;
        this.collectionSlots.forEach(collectionSlot => collectionSlot.visible = false);
        this.collectionPanel.visible = false;
        this.scrollToTop();
        this.pendingCardType = card.type;

        this.arrows = [];
        for (let i = 0; i < 3; ++i) {
            this.arrows[i] = new cc.Sprite(asset.cardSwitchArrow_png);
            this.arrows[i].attr({
                x: cf.WIDTH / 2,
                y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * (1.05 + 0.05 * i),
                scale: cf.HEIGHT * 0.05 / this.arrows[i].height,
                opacity: 0,
            });
            this.addChild(this.arrows[i]);
            let j = i;
            this.arrows[j].runAction(cc.sequence(cc.DelayTime(1 / 2 * (2 - j)), cc.callFunc(() => {
                this.arrows[j].runAction(cc.sequence(cc.FadeIn(0.6), cc.FadeOut(0.6), cc.DelayTime(0.8)).repeatForever());
            })));
        }

        this.swapInCardSlot = new CardSlot(card, false);
        this.swapInCardSlot.attr({
            x: cf.WIDTH / 2,
            y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * 1.37,
            scale: cf.WIDTH / (4 + 5 * 0.3) / this.swapInCardSlot.width,
        });
        this.addChild(this.swapInCardSlot);

        this.swapInCardSlot.outline = new cc.Sprite(asset.cardSwitchOutline_png);
        this.swapInCardSlot.outline.attr({
            x: this.swapInCardSlot.width / 2,
            y: this.swapInCardSlot.height / 2,
            scale: this.swapInCardSlot.height * 1.15 / this.swapInCardSlot.outline.height,
        });
        this.swapInCardSlot.addChild(this.swapInCardSlot.outline, -1);

        this.swapInCardSlot.glossy = new cc.Sprite(asset.cardSwitchGlossy_png);
        this.swapInCardSlot.glossy.attr({
            x: this.swapInCardSlot.width / 2,
            y: this.swapInCardSlot.height / 2,
            scale: this.swapInCardSlot.width / this.swapInCardSlot.glossy.width,
        });
        this.swapInCardSlot.addChild(this.swapInCardSlot.glossy);

        let swapInCardFadeSequence = cc.sequence(
            cc.FadeOut(1),
            cc.FadeIn(1)
        ).repeatForever();
        this.swapInCardSlot.outline.runAction(swapInCardFadeSequence);
        this.swapInCardSlot.glossy.runAction(swapInCardFadeSequence.clone());

        this.lbInstruction = new ccui.Text('Chọn một thẻ bài thay thế', asset.svnSupercellMagic_ttf, 20);
        this.lbInstruction.attr({
            x: cf.WIDTH / 2,
            y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * 1.6,
            color: cc.color(56, 229, 255),

        });
        this.addChild(this.lbInstruction);

        this.exitBtn = new ccui.Button(asset.btnRed_png);
        this.exitBtn.setZoomScale(0);
        this.exitBtn.attr({
            x: cf.WIDTH / 2,
            y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * 1.7,
            scale: cf.WIDTH / (4 + 5 * 0.3) / this.exitBtn.width,
        });
        this.exitBtn.addClickEventListener(() => {
            this.swapInCardSlot.removeFromParent(true);
            this.quitAddCardToDeck();
        });
        this.addChild(this.exitBtn);

        let lbExit = new ccui.Text('Thoát', asset.svnSupercellMagic_ttf, 24);
        lbExit.enableShadow();
        lbExit.setPosition(this.exitBtn.width / 2, this.exitBtn.height / 2);
        this.exitBtn.addChild(lbExit);

        this.setUpperboundBasedOnTheLowestItem(this.exitBtn.y);
    },

    quitAddCardToDeck: function () {
        this.pendingCardType = undefined;
        this.pendingDeckSlot = undefined;
        this.arrows.forEach(arrow => this.removeChild(arrow));
        this.removeChild(this.lbInstruction);
        this.removeChild(this.exitBtn);
        this.parent.allBtnIsActive = true;
        this.isShowingAddCardToDeck = false;
        this.collectionSlots.forEach(collectionSlot => collectionSlot.visible = true);
        this.collectionPanel.visible = true;
        let lastCardSlot = this.collectionSlots[this.collectionSlots.length - 1];
        this.setUpperboundBasedOnTheLowestItem(lastCardSlot.y);
    },

    updateSwapCardIntoDeck: function () {
        let slot = this.pendingDeckSlot;
        let destination = {};
        destination.x = this.deckPanel.x - (this.deckPanel.width / 2 - this.deckSlots[slot].x) * this.deckPanel.scale;
        destination.y = this.deckPanel.y - (this.deckPanel.height - this.deckSlots[slot].y) * this.deckPanel.scale;
        this.deckPanel.removeChild(this.deckSlots[slot]);

        let sequence = cc.sequence(
            cc.callFunc(() => {
                this.exitBtn.visible = false;
                this.isShowingAddCardToDeck = false;
            }),
            cc.moveTo(0.25, cc.p(destination.x, destination.y)),
            cc.callFunc(() => {
                let row = Math.floor(slot / 4);
                let column = slot - row * 4;
                let slotWidth = this.deckPanel.width / (4 + 5 * 0.3);
                let spaceBetween = slotWidth * 0.3;
                let cardSlotX = spaceBetween * (column + 1) + slotWidth * (column + 0.5);
                let cardSlotY = this.deckPanel.height * (0.7 - 0.37 * row);
                this.swapInCardSlot.attr({
                    x: cardSlotX,
                    y: cardSlotY,
                    scale: slotWidth / this.swapInCardSlot.width,
                });
                this.swapInCardSlot.outline.removeFromParent(true);
                this.swapInCardSlot.glossy.removeFromParent(true);
                this.swapInCardSlot.removeFromParent(false);
                this.deckPanel.addChild(this.swapInCardSlot);
                this.deckSlots[slot] = this.swapInCardSlot;
                this.swapInCardSlot.inDeck = true;
                this.swapInCardSlot.updateClickEventListener();
                this.updateAllCardSlots();
                this.quitAddCardToDeck();
            })
        );
        this.swapInCardSlot.runAction(sequence);
    },

    updateAllCardSlots: function () {
        for (let i = 0; i < this.collectionSlots.length; i++) {
            this.collectionSlots[i].removeFromParent(true);
            this.collectionSlots[i] = undefined;
        }
        this.initCollection();
        this.deckSlots.forEach(deckSlot => this.deckPanel.removeChild(deckSlot));
        for (let i = 0; i < sharePlayerInfo.deck.length; i++) {
            let card = sharePlayerInfo.deck[i];
            this.addCardSlotToDeckPanel(card, i);
        }
    },

    updateCardSlotWithType: function (type) {
        let card = sharePlayerInfo.collection.find(card => card.type === type);
        if (card === undefined) {
            cc.log('Cannot find type ' + type + ' in collection.');
            return;
        }
        for (let i = 0; i < this.deckSlots.length; i++) {
            if (this.deckSlots[i].card.type === type) {
                this.deckSlots[i].removeFromParent(true);
                this.addCardSlotToDeckPanel(card, i);
                break;
            }
        }
        for (let i = 0; i < this.collectionSlots.length; i++) {
            if (this.collectionSlots[i].card.type === type) {
                // update gold
                sharePlayerInfo.gold -= this.collectionSlots[i].card.reqGold;
                this.parent.currencyPanel.updateLabels();
                if (!card.isInDeck()) {
                    this.collectionSlots[i].removeFromParent(true);
                    this.addCardSlotToCollection(card, this.findEmptySlotInCollectionSlots());
                }
                break;
            }
        }
    },

    setUpperboundBasedOnTheLowestItem: function (itemY) {
        this.upperbound = this.currentScroll + cf.WIDTH / (123 / 110 * 4 + 164 / 122) + cf.WIDTH / (4 + 5 * 0.3) * (186 / 138) - itemY;
        if (this.upperbound < 0) {
            this.upperbound = 0;
        }
        cc.log('Upperbound updated: ' + this.upperbound);
    },

    scrollToTop: function () {
        let distance = -this.currentScroll;
        this.currentScroll += distance;
        this.getChildren().forEach(child => child.y += distance);
    },

    resetCardsUIState: function () {
        if (this.isShowingAddCardToDeck) {
            this.swapInCardSlot.removeFromParent(true);
            this.quitAddCardToDeck();
        }
        this.scrollToTop();
    },

    addVerticalScrollByTouchListener: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: () => {
                if (this.parent.activeTab !== cf.LOBBY_TAB_CARDS || (!this.parent.allBtnIsActive && !this.isShowingAddCardToDeck)) return false;
                this.isScrolling = false;
                this.scrollTouching = true;
                return true;
            },
            onTouchMoved: (touch) => {
                if (this.parent.activeTab !== cf.LOBBY_TAB_CARDS || (!this.parent.allBtnIsActive && !this.isShowingAddCardToDeck) || !this.scrollTouching) return;

                if (this.parent.acceptHorizontalScroll) {
                    this.endVerticalScroll();
                }

                let delta = touch.getDelta();
                this.currentScroll += delta.y;
                this.getChildren().forEach(child => child.y += delta.y);
                if (Math.sqrt(delta.x * delta.x + delta.y * delta.y) > this.DISTANCE_SCROLL_ACCEPT) {
                    this.isScrolling = true;
                }
                this.finalDeltaY = delta.y;
                return true;
            },
            onTouchEnded: (touch) => {
                if (this.isVisible() && this.isShowingAddCardToDeck && !this.isScrolling) {
                    if (touch.getLocation().y >= this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale) {
                        return false;
                    }
                    this.resetCardsUIState();
                    return true;
                }
                if (this.parent.activeTab !== cf.LOBBY_TAB_CARDS || (!this.parent.allBtnIsActive && !this.isShowingAddCardToDeck)) return false;
                this.endVerticalScroll();
            },
        }, this);
    },

    endVerticalScroll: function () {
        cc.log("Final delta y: " + this.finalDeltaY);
        // todo chuyển động chậm dần đều?
        this.scrollTouching = false;
        if (this.currentScroll < this.lowerbound) {
            this.getChildren().forEach(child => {
                child.runAction(new cc.MoveBy(0.5, cc.p(0, this.lowerbound - this.currentScroll)));
            });
            this.currentScroll = this.lowerbound;
        } else if (this.currentScroll > this.upperbound) {
            this.getChildren().forEach(child => {
                child.runAction(new cc.MoveBy(0.5, cc.p(0, this.upperbound - this.currentScroll)));
            });
            this.currentScroll = this.upperbound;
        }
        return true;
    },
});
