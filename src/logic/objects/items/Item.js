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
        this.init();


    },

    updateMove: function ( dt) {

    },
    init: function () {
        if(this.type === GAME_CONFIG.ITEM_WEAPON){
            this.initWeapon();
        }

        if(this.type === GAME_CONFIG.ITEM_POTION){
            this.initPotion();
        }

        if(this.type === GAME_CONFIG.ITEM_GATE){
            this.initGate();
        }

    },

    initWeapon: function () {
        this.setScale(1.8)
        switch (this.id)
        {
            case cf.WP_TYPE.DOUBLE_GUN:
                this.setTexture(res.gun2);
                break;
            case cf.WP_TYPE.SHORT_GUN:
                this.setTexture(res.gun);
                break;

        }
    },

    initPotion: function () {
        switch (this.id)
        {
            case cf.POTION_TYPE.SMALL_HEAL:
                this.setTexture(res.gold);
                break;
            case cf.POTION_TYPE.SMALL_MANA:
                this.setTexture(res.gold);
                break;

        }
    },

    initGate: function () {
        this.setTexture(res.gold);
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
        this.setColor(cc.color(0,0,220,255));
    },

    hideActive: function () {
        this.isCanActive = false;
        BackgroundLayerInstance.isItemCanActive = false;
        this.setColor(cc.color(255,255,220,255));
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
    },

    activeItemWeapon: function() {
        let wp = null;
        let player = BackgroundLayerInstance.player;
        switch (this.id)
        {
            case cf.WP_TYPE.DOUBLE_GUN:
                wp = new DoubleGun(player.posLogic, player._map)
                break;
            case cf.WP_TYPE.SHORT_GUN:
                wp = new ShortGun(player.posLogic, player._map)
                break;

        }
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
                break;

        }
        this.visible = false;
        this.isDestroy = true;
    },

    activeItemGate: function() {
        GamelayerInstance.viewNewMap(this.gateId);
    },

    updateGateId: function(id) {
        this.gateId = id;
    },

    render: function () {
        var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        this.setPosition(posUI)
    },




});