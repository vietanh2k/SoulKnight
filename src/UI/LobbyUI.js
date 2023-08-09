
var LobbyUI = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();



    },
    init:function () {

        winSize = cc.director.getWinSize();
        this.initBackGround();
        return true;
    },
    initBackGround:function()
    {
        var backg = new cc.Sprite(res.gameBack);
        backg.setAnchorPoint(0,0)
        this.addChild(backg);

        this.btnStart = ccs.load(res.btnStart, "").node;
        this.btnStart.scale = 0.8;
        this.btnStart.setPosition(winSize.width/2, winSize.height/5);
        this.addChild(this.btnStart);
        this.btnStart.getChildByName("btn").addClickEventListener(() => {
            fr.view(CharUI, 0.5 );
        });
    },

    addObjectBackground:function (res, scaleW,scaleH, positionX, positionY) {
        var obj = new cc.Sprite(res);
        if(scaleW > 0){
            obj.setScale(WIDTHSIZE/obj.getContentSize().width*scaleW)
        }else if(scaleH > 0){
            obj.setScale(HEIGHTSIZE/obj.getContentSize().height*scaleH)
        }
        obj.setPosition(winSize.width/2 + WIDTHSIZE*positionX, winSize.height/2+HEIGHTSIZE*positionY)
        this.addChild(obj);

    },

    joinGame:function () {
        cc.log('join gameeeeeeeeeeee')
        fr.view(GameUI)
        // var scene = new cc.Scene();
        // scene.addChild(new GameUI());
        // cc.director.runScene(new cc.TransitionFade(1.2, scene));

    },

    backToLobby:function () {
        fr.view(LobbyScene)
        // let lobbyScene = new LobbyScene();
        // cc.director.runScene(new cc.TransitionFade(0.5, lobbyScene));

    },
    onMatching:function()
    {
        cc.log("sendMatchingRequest");
        try{
            testnetwork.connector.sendMatchRequest();


        } catch (e){
            cc.log(e);
            cc.log(e.stack)
            cc.log('errrrrrrrrrrror')
        }

    },

    requestConfirmMatch:function()
    {
        cc.log("sendMatchingConfirm");
        try{
            testnetwork.connector.sendConfirmMatch();
            this.getChildByName('btnCalcel').loadTextureNormal('res/common/common_btn_gray.png');
            this.getChildByName('btnCalcel').setTouchEnabled(false);
            this.runAction(cc.sequence(
                cc.delayTime(1.5), cc.callFunc(()=>{
                    this.getChildByName('btnCalcel').loadTextureNormal('res/common/common_btn_red.png');
                    this.getChildByName('btnCalcel').setTouchEnabled(true);
                })
            ))


        } catch (e){
            cc.log('errrrrrrrrrrror')
        }

    },
    updateJoinUI:function()
    {
        this.getChildByName('btnCalcel').setTitleText('Vào Trận')
        this.getChildByName('btnCalcel').loadTextureNormal('res/common/common_btn_blue.png')
        this.getChildByName('btnCalcel').setTouchEnabled(false)
    },


});

LobbyUI.scene = function () {
    var scene = new cc.Scene();
    var layer = new LobbyUI();
    scene.addChild(layer);
    return scene;
};
