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
                this.sortByEnergyAsc = true;
            } else {
                this.sortByEnergyAsc = !this.sortByEnergyAsc;
            }
            this.sortCollectionSlotsByEnergy();
        });
        this.collectionPanel.addChild(this.sortByEnergyBtn);

        this.collectionSlots = [];
        for (let i = 0; i < sharePlayerInfo.collection.length; i++) {
            let card = sharePlayerInfo.collection[i];
            this.addCardSlotToCollection(card, i);
        }
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
        this.setUpperboundBasedOnTheLowestItem(cardSlotY);
    },

    sortCollectionSlotsByEnergy: function () {
        this.collectionSlots.forEach(collectionSlot => this.removeChild(collectionSlot));
        sharePlayerInfo.sortCollectionByEnergy(this.sortByEnergyAsc);

        for (let i = 0; i < sharePlayerInfo.collection.length; i++) {
            let card = sharePlayerInfo.collection[i];
            this.addCardSlotToCollection(card, i);
        }
    },

    showAddCardToDeck: function (card) {
        this.parent.allBtnIsActive = false;
        this.isShowingAddCardToDeck = true;
        this.collectionSlots.forEach(collectionSlot => collectionSlot.visible = false);
        this.collectionPanel.visible = false;
        this.scrollToTop();
        this.pendingCardId = card.id;

        this.arrows = [];
        for (let i = 0; i < 3; ++i) {
            this.arrows[i] = new cc.Sprite(asset.cardSwitchArrow_png);

            this.arrows[i].attr({
                x: cf.WIDTH / 2,
                y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * (1.05 + 0.05 * i),
                scale: cf.HEIGHT * 0.05 / this.arrows[i].height,
                opacity: 255 - 100 * i,
            });
            this.addChild(this.arrows[i]);
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

        let fadeSequence = cc.sequence(
            cc.FadeOut(0.5),
            cc.FadeIn(0.5)
        ).repeatForever();
        this.swapInCardSlot.outline.runAction(fadeSequence);

        this.lbInstruction = new ccui.Text('Chọn một thẻ bài thay thế', asset.svnSupercellMagic_ttf, 20);
        this.lbInstruction.attr({
            x: cf.WIDTH / 2,
            y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * 1.6,
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
        this.pendingCardId = undefined;
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

    updateDeckSlot: function (slot) {
        let destination = {};
        destination.x = this.deckPanel.x - (this.deckPanel.width / 2 - this.deckSlots[slot].x) * this.deckPanel.scale;
        destination.y = this.deckPanel.y - (this.deckPanel.height - this.deckSlots[slot].y) * this.deckPanel.scale;
        this.deckPanel.removeChild(this.deckSlots[slot]);

        let sequence = cc.sequence(
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
                this.swapInCardSlot.parent = null;
                this.deckPanel.addChild(this.swapInCardSlot);
                this.deckSlots[slot] = this.swapInCardSlot;
                this.swapInCardSlot.inDeck = true;
            })
        );
        this.swapInCardSlot.runAction(sequence);
        this.quitAddCardToDeck();
    },

    updateAllCardSlots: function () {
        this.collectionSlots.forEach(collectionSlot => this.removeChild(collectionSlot));
        this.initCollection();
        this.deckSlots.forEach(deckSlot => this.deckPanel.removeChild(deckSlot));
        for (let i = 0; i < sharePlayerInfo.deck.length; i++) {
            let card = sharePlayerInfo.deck[i];
            this.addCardSlotToDeckPanel(card, i);
        }
    },

    setUpperboundBasedOnTheLowestItem: function (itemY) {
        this.upperbound = this.currentScroll + cf.WIDTH / (123 / 110 * 4 + 164 / 122) + cf.WIDTH / (4 + 5 * 0.3) * (186 / 138) - itemY;
        if (this.upperbound < 0) {
            this.upperbound = 0;
        }
    },

    scrollToTop: function () {
        let distance = - this.currentScroll;
        this.currentScroll += distance;
        this.getChildren().forEach(child => child.y += distance);
    },

    addVerticalScrollByTouchListener: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: () => {
                if (!this.visible || (!this.parent.allBtnIsActive && !this.isShowingAddCardToDeck)) return false;
                this.isScrolling = false;
                this.scrollTouching = true;
                return true;
            },
            onTouchMoved: (event) => {
                if (!this.visible || (!this.parent.allBtnIsActive && !this.isShowingAddCardToDeck) || !this.scrollTouching) return;
                let delta = event.getDelta();
                this.currentScroll += delta.y;
                this.getChildren().forEach(child => child.y += delta.y);
                if (Math.sqrt(delta.x * delta.x + delta.y * delta.y) > this.DISTANCE_SCROLL_ACCEPT) {
                    this.isScrolling = true;
                }
                return true;
            },
            onTouchEnded: () => {
                if (!this.visible || (!this.parent.allBtnIsActive && !this.isShowingAddCardToDeck)) return false;
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
        }, this);
    },
});
