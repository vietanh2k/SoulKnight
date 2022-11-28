let LobbyInstant = null

var LobbyScene = cc.Scene.extend({
    background: null,
    currencyPanel: null,
    tabBtns: null,
    tabIcons: null,
    tabTexts: null,
    tabUIs: null,

    activeTab: 2, // default active tab is Home (0-based)
    activeTabBtnWidth: null,
    inactiveTabBtnWidth: null,
    tabBtnHeight: null,

    allBtnIsActive: true,

    ctor: function () {
        this._super();
        LobbyInstant = this
        this.initBackGround(0);
        cc.log('initBackGround')
        this.initCurrencyPanel(2);
        cc.log('initCurrencyPanel')
        this.calcTabBtnSize();
        cc.log('calcTabBtnSize')
        this.initTabs(2);
        cc.log('initTabs')
        this.initTabUIs(1);
        cc.log('initTabUIs')
    },

    initBackGround: function (localZOrder) {
        this.background = new cc.Sprite(asset.lobbyBackground_png);
        this.background.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT / 2,
            scaleX: cf.WIDTH / this.background.width,
            scaleY: cf.HEIGHT / this.background.height,
        });
        this.addChild(this.background, localZOrder);
    },

    initCurrencyPanel: function (localZOrder) {
        this.currencyPanel = new CurrencyPanel();
        this.addChild(this.currencyPanel, localZOrder);
    },

    calcTabBtnSize: function () {
        const ACTIVE_INACTIVE_WIDTH_RATIO = 164 / 122 / 123 * 110;
        this.inactiveTabBtnWidth = cf.WIDTH / (cf.LOBBY_MAX_TAB - 1 + ACTIVE_INACTIVE_WIDTH_RATIO);
        this.activeTabBtnWidth = cf.WIDTH / (1 + (cf.LOBBY_MAX_TAB - 1) / ACTIVE_INACTIVE_WIDTH_RATIO);
        this.tabBtnHeight = this.inactiveTabBtnWidth / 123 * 110 * 1.03;
    },

    findTabAnchorPosX: function (tab) {
        if (tab < this.activeTab) {
            return (tab + 0.5) * this.inactiveTabBtnWidth;
        }
        if (tab > this.activeTab) {
            return cf.WIDTH - (cf.LOBBY_MAX_TAB - tab - 0.5) * this.inactiveTabBtnWidth;
        }
        return tab * this.inactiveTabBtnWidth + 0.5 * this.activeTabBtnWidth;
    },

    initTabs: function (localZOrder) {
        this.tabBtns = [];
        this.tabIcons = [];
        this.tabTexts = [];
        for (let i = 0; i < cf.LOBBY_MAX_TAB; i++) {
            let newTab;
            let newTabIcon = cc.Sprite(asset.lobbyPageIcons_png[i]);
            let newTabText = ccui.Text(cf.LOBBY_TAB_NAMES[i], asset.svnSupercellMagic_ttf, 16);
            newTabText.enableShadow();
            if (i === this.activeTab) {
                newTab = new ccui.Button(asset.lobbyPageBtnSelecting_png);
                newTabIcon.y = newTab.height / 2 * 1.2;
                newTabText.visible = true;
            } else {
                newTab = new ccui.Button(asset.lobbyPageBtns_png[(i + (i > this.activeTab)) % 2]);
                newTabIcon.y = newTab.height / 2;
                newTabText.visible = false;
            }
            newTab.setZoomScale(0);
            newTabIcon.attr({
                x: newTab.width / 2,
                scale: newTab.height * 0.8 / newTabIcon.height,
            });
            newTabText.attr({
                x: newTab.width / 2,
                y: newTab.height / 2 * 0.4,
                scale: newTab.height * 0.3 / newTabText.height,
            });
            newTab.attr({
                x: this.findTabAnchorPosX(i),
                y: this.tabBtnHeight / 2,
                scale: this.tabBtnHeight / newTab.height,
            });
            let j = i; // create a new closure scope for next callback
            newTab.addClickEventListener(() => {
                if (this.allBtnIsActive) {
                    this.changeToTab(j);
                } else if (this.activeTab === cf.LOBBY_TAB_CARDS && this.tabUIs[cf.LOBBY_TAB_CARDS].isShowingAddCardToDeck) {
                    this.changeToTab(j);
                    this.allBtnIsActive = true;
                }
                else {
                    cc.log('allBtnIsActive is false');
                }
            });
            newTab.addChild(newTabIcon);
            newTab.addChild(newTabText);
            this.tabBtns.push(newTab);
            this.tabIcons.push(newTabIcon);
            this.tabTexts.push(newTabText);
            this.addChild(newTab, localZOrder);
        }
    },

    changeToTab: function (newTab) {
        if(newTab == cf.LOBBY_TAB_SHOP && LobbyInstant.tabUIs[cf.LOBBY_TAB_SHOP].checkLoadSuccess == false) {
            // fr.view(ShopUI);
            this.requestOffer()
        }
        if (newTab === this.activeTab) {
            return;
        }
        this.activeTab = newTab;
        this.resizeTabs();
        this.updateTabUIsVisibility();
        if (this.activeTab === cf.LOBBY_TAB_CARDS) {
            this.tabUIs[cf.LOBBY_TAB_CARDS].resetCardsUIState();
        }
    },

    resizeTabs: function () {
        for (let i = 0; i < cf.LOBBY_MAX_TAB; i++) {
            if (i === this.activeTab) {
                this.tabBtns[i].loadTextures(asset.lobbyPageBtnSelecting_png, asset.lobbyPageBtnSelecting_png, asset.lobbyPageBtnSelecting_png);
                this.tabIcons[i].y = this.tabBtns[i].height / 2 * 1.2;
                this.tabTexts[i].visible = true;
            } else {
                this.tabBtns[i].loadTextures(asset.lobbyPageBtns_png[(i + (i > this.activeTab)) % 2], asset.lobbyPageBtns_png[(i + (i > this.activeTab)) % 2]);
                this.tabIcons[i].y = this.tabBtns[i].height / 2;
                this.tabTexts[i].visible = false;
            }
            this.tabBtns[i].attr({
                x: this.findTabAnchorPosX(i),
                scale: this.tabBtnHeight / this.tabBtns[i].height,
            });
            this.tabIcons[i].x = this.tabBtns[i].width / 2;
            this.tabTexts[i].x = this.tabBtns[i].width / 2;
        }
    },

    initTabUIs: function (localZOrder) {
        this.tabUIs = [];
        cc.log('cf.LOBBY_TAB_SHOP')
        this.tabUIs[cf.LOBBY_TAB_SHOP] = new ShopUI();
        cc.log('cf.LOBBY_TAB_CARDS')
        this.tabUIs[cf.LOBBY_TAB_CARDS] = new CardsUI();
        this.tabUIs[cf.LOBBY_TAB_HOME] = new HomeUI();
        for (let i = 0; i < cf.LOBBY_MAX_TAB; i++) {
            if (this.tabUIs[i] !== undefined) {
                this.addChild(this.tabUIs[i], localZOrder);
            }
        }
        this.updateTabUIsVisibility();
    },

    updateTabUIsVisibility: function () {
        for (let i = 0; i < cf.LOBBY_MAX_TAB; i++) {
            if (this.tabUIs[i] !== undefined) {
                this.tabUIs[i].visible = i === this.activeTab;
            }
        }
    },

    runOpenChestAnimation: function (newCards, goldReceived) {
        this.addChild(new OpenChestAnimationUI(newCards, goldReceived), 3);
        this.allBtnIsActive = false;
    },

    runUpgradeCardAnimation: function (oldCard, newCard) {
        this.addChild(new UpgradeCardAnimationUI(oldCard, newCard), 5);
        this.allBtnIsActive = false;
    },

    removeCardInfoUI: function (child, resetAllBtnIsActive) {
        child.removeFromParent(true);
        if (resetAllBtnIsActive) {
            setTimeout(() => this.allBtnIsActive = true, 0.01);
        }
    },
    requestOffer: function () {
        cc.log("sendRequestOffer");
        try{
            testnetwork.connector.sendRequestOffer();


        } catch (e){
            cc.log('errrrrrrrrrrror')
        }
    },
});
