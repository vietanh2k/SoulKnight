MAP_WIDTH = 7;
MAP_HEIGHT = 5;
MAP_RATIO = 15/8;

var MatchingUI = cc.Layer.extend({
    mapWidth: null,
    mapHeight: null,

    ctor:function () {
        this._super();
        this.init();



    },
    init:function () {

        winSize = cc.director.getWinSize();


        this.initBackGround();
        // this.schedule(this.joinGame,7)




        return true;
    },
    initBackGround:function()
    {
        var backg = new cc.Sprite(res.logoBack_png);
        backg.setAnchorPoint(0,0)
        backg.setScaleY(winSize.height/backg.getContentSize().height)
        backg.setScaleX(winSize.width/backg.getContentSize().width)
        this.addChild(backg);

        this.addObjectBackground(res.lightAround,0,5.5/7,0,0.3/9)
        this.addObjectBackground(res.lightAround,0,5.5/7,0,0.3/9)
        this.addObjectBackground(res.lightAround,0,5.5/7,0,0.3/9)
        this.addObjectBackground(res.arenaForest,4.3/7,0,0,1.1/9)


        var battleName = new ccui.Text('ĐỒI NGỦ YÊN', res.font_magic, 33)
        battleName.setPosition(winSize.width/2, winSize.height/2+HEIGHTSIZE*-0.3/9)
        battleName.enableShadow()
        this.addChild(battleName)


        var button = ccui.Button(res.buttonRed);
        button.setTitleText('HỦY BỎ')
        button.setTitleFontName(res.font_magic)

        button.setScale((WIDTHSIZE*2.7/7)/button.getNormalTextureSize().width)
        button.setTitleFontSize(24)
        button.setPosition(winSize.width/2, winSize.height/2+HEIGHTSIZE*-2/9)
        button.addClickEventListener(this.onMatching);
        this.addChild(button);

        var lbFindingEnemy = new ccui.Text('Đang tìm đối thủ...', res.font_magic, 30)
        lbFindingEnemy.setPosition(winSize.width/2+WIDTHSIZE*-1/9, winSize.height/2+HEIGHTSIZE*3.4/9)
        var blueColor = new cc.Color(95,194,217,255);
        lbFindingEnemy.setTextColor(blueColor)
        this.addChild(lbFindingEnemy)

        var lowText1 = new ccui.Text('Hệ thống sẽ tìm đối thủ có cùng mức Trophy...', res.font_normal, 26)
        lowText1.setPosition(winSize.width/2, winSize.height/2+HEIGHTSIZE*-3.95/9)
        var greenColor = new cc.Color(23,177,114,255);
        lowText1.setTextColor(greenColor)
        this.addChild(lowText1)
        var searchIconFather = new cc.Sprite(res.searchIcon)
        searchIconFather.setScale((WIDTHSIZE*1.1/7)/searchIconFather.getContentSize().width/10)
        searchIconFather.setPosition(winSize.width/2+WIDTHSIZE*3/9, winSize.height/2+HEIGHTSIZE*3.4/9)
        var rotateAct1 = cc.RotateBy(1.2,360).repeatForever()
        var rotateAct2 = cc.RotateBy(1.2,-360).repeatForever()
        searchIconFather.runAction(rotateAct1)

        var searchIcon = new cc.Sprite(res.searchIcon)
        searchIcon.setScale(10*(WIDTHSIZE*1.1/7)/searchIcon.getContentSize().width)
        searchIcon.setPosition(0,0)
        searchIcon.runAction(rotateAct2)
        searchIconFather.addChild(searchIcon)
        this.addChild(searchIconFather)

        var par = new cc.ParticleSystem(res.arenaParticle)
        par.setScale(WIDTHSIZE/button.getNormalTextureSize().width*5/7)
        par.setPosition(winSize.width/2,winSize.height/2+HEIGHTSIZE*1.1/9)
        this.addChild(par)

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
        var scene = new cc.Scene();
        scene.addChild(new GameUI());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));

    },
    onMatching:function()
    {
        cc.log("sendMatchingRequest");
        try{
            testnetwork.connector.sendMatchRequest();


        } catch (e){
            cc.log('errrrrrrrrrrror')
        }

    },


});

MatchingUI.scene = function () {
    var scene = new cc.Scene();
    var layer = new MatchingUI();
    scene.addChild(layer);
    return scene;
};