
var ShopUI = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init()
        this.m = 45
        this.s = 10
        this.scheduleUpdate();
    },
    init:function () {

        winSize = cc.director.getWinSize();

        this.initBackGround();



        return true;
    },



    initBackGround:function()
    {
        var mainscene = ccs.load(res.shopScene, "").node;
        var item1 = ccs.load(res.shopItem, "").node
        mainscene.getChildByName('nodeItem1').addChild(item1)
        var item2 = ccs.load(res.shopItem, "").node
        mainscene.getChildByName('nodeItem2').addChild(item2)
        var item3 = ccs.load(res.shopItem, "").node
        mainscene.getChildByName('nodeItem3').addChild(item3)

        this.addChild(mainscene,0,'scene');


    },
    updateRealTime:function (dt){
        this.s -= dt
        if(this.s <0) {
            this.s = 60
            this.m -= 1
        }
    },

    updateTimeUI:function (dt){
        var str
        if(this.m >0){
            str = this.m+'m ' +Math.floor(this.s) +'s'
        }else{
            str = this.s +'s'
        }

        this.getChildByName('scene').getChildByName('loginItem').getChildByName('time').setString(str)
    },
    update:function (dt){
        this.updateRealTime(dt)
        this.updateTimeUI()
    },



});

