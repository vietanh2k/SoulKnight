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


    ctor: function () {
        this._super();

        this.initDeckPanel();
        this.initCollection();

        this.addTouchListener();
    },

    initDeckPanel: function () {
        this.deckPanel = new cc.Sprite(asset.deckPanel_png);
        this.deckPanel.attr({
            anchorY: 1,
            x: CFG.WIDTH / 2,
            y: CFG.HEIGHT - CFG.WIDTH / 854 * 85,
            scale: CFG.WIDTH / this.deckPanel.width,
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
        for (let i = 0; i < 8; i++) {
            let card = FAKE.deck[i];
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
            x: CFG.WIDTH / 2,
            y: CFG.HEIGHT - CFG.WIDTH / 854 * 85 - CFG.WIDTH / 682 * 604,
            scale: CFG.WIDTH / this.collectionPanel.width * (4 + 3 * 0.3) / (4 + 5 * 0.3),
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
        this.collectionSlots = [];
        for (let i = 0; i < FAKE.collection.length; i++) {
            let card = FAKE.collection[i];
            this.addCardSlotToCollection(card, i);
        }
    },

    addCardSlotToCollection: function (card, index) {
        let row = Math.floor(index / 4);
        let column = index - row * 4;
        let slotWidth = CFG.WIDTH / (4 + 5 * 0.3);
        let spaceBetween = slotWidth * 0.3;
        let cardSlotX = spaceBetween * (column + 1) + slotWidth * (column + 0.5);
        let cardSlotY = this.deckPanel.y - this.deckPanel.height * this.deckPanel.scale * (1.32 + 0.38 * row);
        let newCardSlot = new CardSlot(card, true);
        newCardSlot.attr({
            x: cardSlotX,
            y: cardSlotY,
            scale: slotWidth / newCardSlot.width,
        });
        this.addChild(newCardSlot);
        this.collectionSlots[index] = newCardSlot;
        this.upperbound = CFG.WIDTH / (123 / 110 * 4 + 164 / 122) + CFG.WIDTH / (4 + 5 * 0.3) * (186 / 138) - cardSlotY;
        if (this.upperbound < 0) {
            this.upperbound = 0;
        }
    },

    addTouchListener: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: () => {
                if (!this.visible) return false;
                this.scrollTouching = true;
                return true;
            },
            onTouchMoved: (event) => {
                if (!this.visible || !this.scrollTouching) return;
                let distance = event.getDelta().y;
                this.currentScroll += distance;
                this.getChildren().forEach(child => child.y += distance);
                return true;
            },
            onTouchEnded: () => {
                if (!this.visible) return false;
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
