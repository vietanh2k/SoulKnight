// this.parent: LobbyScene
var CurrencyPanel = cc.Layer.extend({
    currencyBackground: null,
    leftBox: null,
    rightBox: null,
    leftCurrencyBtn: null,
    rightCurrencyBtn: null,
    iconGold: null,
    iconGem: null,
    lbGold: null,
    lbGem: null,
    lbScale: 1,

    ctor: function () {
        this._super();
        this.tmpGold = sharePlayerInfo.gold
        this.tmpGem = sharePlayerInfo.gem
        cc.log(sharePlayerInfo)
        this.updateLabels()
        this.currencyBackground = new cc.Sprite(asset.currencyBackground_png);
        this.currencyBackground.attr({
            anchorX: 0,
            anchorY: 1,
            y: cf.HEIGHT,
            scale: cf.WIDTH / this.currencyBackground.width,
        });
        this.addChild(this.currencyBackground, 0);

        this.leftBox = new cc.Sprite(asset.lobbyBox_png);
        this.leftBox.attr({
            x: cf.WIDTH * 0.35,
            y: cf.HEIGHT - this.currencyBackground.height * this.currencyBackground.scale * 0.4,
            scale: this.currencyBackground.height * this.currencyBackground.scale * 0.6 / this.leftBox.height,
        });
        this.addChild(this.leftBox, 0);

        this.rightBox = new cc.Sprite(asset.lobbyBox_png);
        this.rightBox.attr({
            x: cf.WIDTH * 0.65,
            y: cf.HEIGHT - this.currencyBackground.height * this.currencyBackground.scale * 0.4,
            scale: this.currencyBackground.height * this.currencyBackground.scale * 0.6 / this.leftBox.height,
        });
        this.addChild(this.rightBox, 0);

        this.iconGold = new cc.Sprite(asset.iconGold_png);
        this.iconGold.attr({
            x: this.leftBox.x - this.leftBox.width * this.leftBox.scale / 2,
            y: this.leftBox.y,
            scale: this.leftBox.height * this.leftBox.scale / this.iconGold.height,
        });
        this.addChild(this.iconGold, 0);

        this.iconGem = new cc.Sprite(asset.iconGem_png);
        this.iconGem.attr({
            x: this.rightBox.x - this.rightBox.width * this.rightBox.scale / 2,
            y: this.rightBox.y,
            scale: this.rightBox.height * this.rightBox.scale / this.iconGem.height,
        });
        this.addChild(this.iconGem, 0);

        this.leftCurrencyBtn = new ccui.Button(asset.currencyBtnTopUp_png);
        this.leftCurrencyBtn.attr({
            x: this.leftBox.x + this.leftBox.width * this.leftBox.scale / 2,
            y: this.leftBox.y,
            scale: this.leftBox.height * this.leftBox.scale / this.leftCurrencyBtn.height,
        });
        this.leftCurrencyBtn.addClickEventListener(() => {
            if (this.parent.allBtnIsActive) {
                sharePlayerInfo.gold += cf.AMOUNT_BTN_GOLD;
                this.updateLabels();
            } else {
                cc.log('allBtnIsActive is false');
            }
        });
        this.addChild(this.leftCurrencyBtn, 0);

        this.rightCurrencyBtn = new ccui.Button(asset.currencyBtnTopUp_png);
        this.rightCurrencyBtn.attr({
            x: this.rightBox.x + this.rightBox.width * this.rightBox.scale / 2,
            y: this.rightBox.y,
            scale: this.rightBox.height * this.rightBox.scale / this.rightCurrencyBtn.height,
        });
        this.rightCurrencyBtn.addClickEventListener(() => {
            if (this.parent.allBtnIsActive) {
                testnetwork.connector.sendAddCurrencyRequest(true, cf.AMOUNT_BTN_GEM);
            } else {
                cc.log('allBtnIsActive is false');
            }
        });
        this.addChild(this.rightCurrencyBtn, 0);

        this.lbGold = new ccui.Text(Utils.toStringWithDots(sharePlayerInfo.gold), asset.svnSupercellMagic_ttf, 18);
        this.lbGem = new ccui.Text(Utils.toStringWithDots(sharePlayerInfo.gem), asset.svnSupercellMagic_ttf, 18);
        this.updateLbScale();

        this.lbGold.attr({
            x: this.leftBox.x,
            y: this.leftBox.y,
            scale: this.lbScale,
        });
        this.lbGold.enableShadow();
        this.lbGold.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.addChild(this.lbGold, 0);

        this.lbGem.attr({
            x: this.rightBox.x,
            y: this.rightBox.y,
            scale: this.lbScale,
        });
        this.lbGem.enableShadow();
        this.lbGem.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.addChild(this.lbGem, 0);
    },

    updateLabels2: function () {
        this.lbGold.setString(Utils.toStringWithDots(sharePlayerInfo.gold));
        this.lbGem.setString(Utils.toStringWithDots(sharePlayerInfo.gem));
        this.updateLbScale();
        this.lbGold.scale = this.lbScale;
        this.lbGem.scale = this.lbScale;
    },

    updateLabels: function () {
        var a = setInterval(()=>{
            if (this.tmpGold < sharePlayerInfo.gold) {
                this.tmpGold += 30;
                if(this.tmpGold > sharePlayerInfo.gold){
                    this.tmpGold = sharePlayerInfo.gold
                }
            }
            if (this.tmpGold > sharePlayerInfo.gold) {
                this.tmpGold -= 30;
                if(this.tmpGold < sharePlayerInfo.gold){
                    this.tmpGold = sharePlayerInfo.gold
                }
            }
            if (this.tmpGem < sharePlayerInfo.gem) {
                this.tmpGem += 3;
                if(this.tmpGem > sharePlayerInfo.gem){
                    this.tmpGem = sharePlayerInfo.gem
                }
            }
            if (this.tmpGem > sharePlayerInfo.gem) {
                this.tmpGem -= 3;
                if(this.tmpGem < sharePlayerInfo.gem){
                    this.tmpGem = sharePlayerInfo.gem
                }
            }

            this.lbGold.setString(Utils.toStringWithDots(this.tmpGold));
            this.lbGem.setString(Utils.toStringWithDots(this.tmpGem));
            this.updateLbScale();
            if(this.tmpGold == sharePlayerInfo.gold && this.tmpGem == sharePlayerInfo.gem){
                clearInterval(a);
            }
            // this.lbGold.scale = this.lbScale;
            // this.lbGem.scale = this.lbScale;
        },16)



    },

    updateLabelsGoldFly: function (numGold) {
            // if (this.tmpGold < sharePlayerInfo.gold) {
            //     this.tmpGold += numGold;
            //     if(this.tmpGold > sharePlayerInfo.gold){
            //         this.tmpGold = sharePlayerInfo.gold
            //     }
            // }
        this.tmpGold += numGold;
        // if(this.tmpGold > sharePlayerInfo.gold){
        //     this.tmpGold = sharePlayerInfo.gold
        // }
        this.lbGold.setString(Utils.toStringWithDots(this.tmpGold));
        this.lbGem.setString(Utils.toStringWithDots(this.tmpGem));
        LobbyInstant.tabUIs[cf.LOBBY_TAB_SHOP].updateCanBuyUI()




    },



    updateLbScale: function () {
        this.lbScale = Math.min(
            this.leftBox.width * this.leftBox.scale * 0.7 / this.lbGold.width,
            this.rightBox.width * this.rightBox.scale * 0.7 / this.lbGem.width,
            this.leftBox.height * this.leftBox.scale * 0.8 / this.lbGold.height,
            this.rightBox.height * this.rightBox.scale * 0.8 / this.lbGem.height
        );
    },
});
