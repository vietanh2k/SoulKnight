var ItemShop = Item.extend({
    _map: null,
    speed: 300,


    ctor: function(type, id, posLogic, coinCost) {
        this.coinCost = coinCost;
        this._super(type, id, posLogic);


    },

    init: function () {
        if(this.type === GAME_CONFIG.ITEM_WEAPON){
            this.initWeapon();
        }

        else if(this.type === GAME_CONFIG.ITEM_POTION){
            this.initPotion();
        }

        else if(this.type === GAME_CONFIG.ITEM_GATE){
            this.initGate();
        }

        else if(this.type === GAME_CONFIG.ITEM_CHEST){
            this.initChest();
        }

        let str = ""+this.coinCost;
        var costText = new ccui.Text(str, res.font_normal, 24);
        costText.setTextColor(cc.color(230,200,3,255));
        let pos2 = new cc.p(this.width/2, -10);
        costText.setPosition(pos2)
        costText.scale = 1/this.scale;
        this.addChild(costText)


    },


    activeItem: function () {
        if(SavePlayer.coin < this.coinCost) return;

        SavePlayer.updateCoin(-this.coinCost);
        cc.log("coin="+SavePlayer.coin);
        BackgroundLayerInstance.isItemCanActive = false;
        if(this.type === GAME_CONFIG.ITEM_WEAPON){
            this.activeItemWeapon();
        }

        if(this.type === GAME_CONFIG.ITEM_POTION){
            this.activeItemPotion();
        }

        if(this.type === GAME_CONFIG.ITEM_GATE){
            this.activeItemGate();
        }

        if(this.type === GAME_CONFIG.ITEM_CHEST){
            this.activeItemChest();
        }
    },

    render: function () {
        if(this.isRendered) return;
        this.isRendered = true;
        var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        this.setPosition(posUI)
        this.setLocalZOrder(winSize.height - this.y+CELL_SIZE_UI*2);
    },




});