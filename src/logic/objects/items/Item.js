var Item = cc.Sprite.extend({
    _map: null,
    speed: 300,


    ctor: function(type, id, posLogic) {
        this._super(res.gold);
        this.posLogic = posLogic;
        this.type = type;
        this.id = id;
        this.isCanActive = false;
        this.isDestroy = false;
        this.gateId = null;
        this.isRendered = false;
        if(this.type == GAME_CONFIG.ITEM_GATE){
            var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
            this.setPosition(posUI)
        }

        this.init();


    },

    updateMove: function ( dt) {

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

        else if(this.type === GAME_CONFIG.ITEM_SHOPBACK){
            this.initShopBack();
        }

    },

    initShopBack: function () {
        this.setTexture(res.shopBack);
        this.isNotActive = true;
    },

    initWeapon: function () {
        this.setScale(1.8)
        switch (this.id)
        {
            case cf.WP_TYPE.DOUBLE_GUN:
                this.setTexture(res.gun2);
                break;
            case cf.WP_TYPE.SHORT_GUN:
                this.setTexture(res.shortgun);
                break;
            case cf.WP_TYPE.WATER_GUN:
                this.setTexture(res.gun);
                break;
            case cf.WP_TYPE.NORMAL_GUN:
                this.setTexture(res.gun3);
                break;
            case cf.WP_TYPE.DOUBLE_WATER_GUN:
                this.setTexture(res.doubleWater);
                break;
            case cf.WP_TYPE.TRIPLE_WATER_GUN:
                this.setTexture(res.tripleWater);
                break;
            case cf.WP_TYPE.BAZOKA_GUN:
                this.setTexture(res.bazoka);
                break;
            case cf.WP_TYPE.KATANA:
                this.setTexture(res.katana2);
                break;


        }
    },

    initPotion: function () {
        switch (this.id)
        {
            case cf.POTION_TYPE.SMALL_HEAL:
                this.setTexture(res.smallHp);
                break;
            case cf.POTION_TYPE.SMALL_MANA:
                this.setTexture(res.smallMana);
                break;

        }
    },

    initGate: function () {
        switch (this.id)
        {
            case cf.GATE_TYPE.NEXT_MAP:
                this.setTexture(res.gateMap);
                this.scale = 0.5
                break;
            case cf.GATE_TYPE.NEXT_CHAPTER:
                this.setTexture(res.gateUI);
                this.scale = 0.3

        }

    },

    initChest: function () {
        this.setTexture(res.chest0);
        // const animationFrames = []
        // animationFrames.push(cc.spriteFrameCache.getSpriteFrame("idle_0.png"));
        // animationFrames.push(cc.spriteFrameCache.getSpriteFrame("idle_1.png"));
        // let a = cc.SpriteFrame(res.chest0);
        // cc.log(a)
        // cc.log("a=")
        // let animation = new cc.Animation(animationFrames,5);
        // var animate = new cc.Animate(animation);
        // this.runAction(animate)

    },

    logicUpdate: function (dt) {
        if(!this.isCanActive) return;
        if(cc.pDistance(this.posLogic, BackgroundLayerInstance.player.posLogic) >= GAME_CONFIG.ITEM_DIS_MIN){
            this.hideActive()
        }
    },

    showActive: function () {
        this.isCanActive = true;
        BackgroundLayerInstance.isItemCanActive = true;
        BackgroundLayerInstance.curItem = this
        // this.setColor(cc.color(0,0,220,255));
        if(this.arrowPick == null){
            this.arrowPick = new cc.Sprite(res.arrowPick);
            this.arrowPick.scale = 1/this.scale;
            let pos = new cc.p(this.width/2, this.height+10);
            this.arrowPick.setPosition(pos);
            let seq = cc.sequence(cc.MoveTo(0.5, new cc.p(pos.x, pos.y+15)), cc.MoveTo(0.5, new cc.p(pos.x, pos.y))).repeatForever();
            this.arrowPick.runAction(seq);
            this.addChild(this.arrowPick);
            this.arrowPick.setLocalZOrder(winSize.height - this.arrowPick.y + CELL_SIZE_UI*2);
        }
    },

    hideActive: function () {
        this.isCanActive = false;
        BackgroundLayerInstance.isItemCanActive = false;
        if(this.arrowPick != null){
            this.arrowPick.removeFromParent(true);
            this.arrowPick = null;
        }
    },


    activeItem: function () {
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

    activeItemWeapon: function() {
        let wp = Utils.getWpById(this.id);
        let player = BackgroundLayerInstance.player;
        player.pickWp(wp);
        this.visible = false;
        this.isDestroy = true;
    },

    activeItemPotion: function() {
        let player = BackgroundLayerInstance.player;
        switch (this.id)
        {
            case cf.POTION_TYPE.SMALL_HEAL:
                player.recoverHp(2);
                break;
            case cf.POTION_TYPE.SMALL_MANA:
                player.recoverMana(20);
                GamelayerInstance.updateLabelEnergy(20)
                break;

        }
        this.visible = false;
        this.isDestroy = true;
    },

    activeItemGate: function() {
        GamelayerInstance.viewNewMap(this.gateId);
    },

    activeItemChest: function() {


        setTimeout(()=>{
            this.setTexture(res.chest1)
        },20)
        setTimeout(()=>{
            this.setTexture(res.chest2)
        },70)
        setTimeout(()=>{
            this.setTexture(res.chest3)
        },120)
        setTimeout(()=>{
            this.setTexture(res.chest4)
        },170)
        // this.setTexture(res.chest4);
        this.isNotActive = true;
        this.hideActive()
        switch (this.id)
        {
            case cf.CHEST_TYPE.ITEM:
                setTimeout(()=>{
                    var poss2 = new cc.p(this.posLogic.x, this.posLogic.y);
                    let ranType = Math.floor(Math.random()*2);
                    if(ranType <= 0){
                        let wpSize = Object.keys(cf.WP_TYPE).length;
                        let ran = Math.floor((Math.random() * wpSize) + 1);

                        let m2 = new Item(GAME_CONFIG.ITEM_WEAPON, ran, poss2);
                        let pos = new cc.p(0, 15);
                        let seq = cc.sequence(cc.MoveTo(0.2, pos))
                        BackgroundLayerInstance.objectView.addItem(m2)
                        m2.runAction(seq)
                    }else{
                        let poSize = Object.keys(cf.POTION_TYPE).length;
                        let ran = Math.floor((Math.random() * poSize) + 1);
                        let m2 = new Item(GAME_CONFIG.ITEM_POTION, ran, poss2);
                        let pos = new cc.p(0, 15);
                        let seq = cc.sequence(cc.MoveTo(0.2, pos))
                        BackgroundLayerInstance.objectView.addItem(m2)
                        m2.runAction(seq)
                    }

                }, 150)
                break;
            case cf.CHEST_TYPE.GOLD:
                var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
                let player = BackgroundLayerInstance.player;
                let ran = Math.random()*0.5 + 0.5;
                let numCoin = Math.floor(Math.min(3, CurLvl)*20*ran);
                let numMn = Math.floor(Math.min(1.5, CurLvl/2)*60*ran);
                player.coin += numCoin;
                let posCoin = new cc.p(970, 580);
                let posMana = new cc.p(110, 570);
                let curPos = new cc.p(posUI.x,posUI.y)
                let coin  = new ItemFly(res.coin, curPos, posCoin, numCoin, 1);
                BackgroundLayerInstance.addChild(coin, winSize.height);
                player.recoverMana(numMn);
                let mana  = new ItemFly(res.energyIcon, curPos, posMana, numMn, 2);
                BackgroundLayerInstance.addChild(mana, winSize.height);
                break;

        }


    },

    updateGateId: function(id) {
        this.gateId = id;
    },

    render: function () {
        if(this.isRendered) return;
        this.isRendered = true;
        var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        this.setPosition(posUI)
        this.setLocalZOrder(winSize.height - this.y);
    },




});