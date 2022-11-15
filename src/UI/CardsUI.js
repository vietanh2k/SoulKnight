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

    ctor: function () {
        this._super();

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

        this.arrow = new cc.Sprite(asset.cardSwitchArrow_png);
        this.arrow.attr({
            x: cf.WIDTH / 2,
            y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * 1.05,
            scale: cf.HEIGHT * 0.05 / this.arrow.height,
        });
        this.addChild(this.arrow);

        this.swapInCardSlot = new CardSlot(card, false);
        this.swapInCardSlot.attr({
            x: cf.WIDTH / 2,
            y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * 1.27,
            scale: cf.WIDTH / (4 + 5 * 0.3) / this.swapInCardSlot.width,
        });
        this.addChild(this.swapInCardSlot);

        this.lbInstruction = new ccui.Text('Chọn một thẻ bài thay thế', asset.svnSupercellMagic_ttf, 20);
        this.lbInstruction.attr({
            x: cf.WIDTH / 2,
            y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * 1.51,
        });
        this.addChild(this.lbInstruction);

        this.exitBtn = new ccui.Button(asset.btnRed_png);
        this.exitBtn.setZoomScale(0);
        this.exitBtn.attr({
            x: cf.WIDTH / 2,
            y: this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * 1.61,
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
        this.removeChild(this.arrow);
        this.removeChild(this.swapInCardSlot);
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
        this.deckPanel.removeChild(this.deckSlots[slot]);
        let newCard = sharePlayerInfo.deck[slot];
        this.addCardSlotToDeckPanel(newCard, slot);
        this.quitAddCardToDeck();
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
                this.scrollTouching = true;
                return true;
            },
            onTouchMoved: (event) => {
                if (!this.visible || (!this.parent.allBtnIsActive && !this.isShowingAddCardToDeck) || !this.scrollTouching) return;
                let distance = event.getDelta().y;
                this.currentScroll += distance;
                this.getChildren().forEach(child => child.y += distance);
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
