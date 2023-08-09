
var CharUI = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.infoNode = null;
        this.skillNode = null;
        this.ind = 0;
        this.isDone = true;
        this.init();
        this.listChar = [1,2];
        this.curIdx = 0;



    },
    init:function () {

        winSize = cc.director.getWinSize();
        this.initBackGround();
        this.initCharView();
        return true;
    },
    initBackGround:function()
    {
        var backg = new cc.Sprite(res.gameBack2);
        backg.setAnchorPoint(0,0)
        this.addChild(backg);
        this.showInfo(res.knight, 7, 200, 6);
        this.showSkill(cf.CHAR_TYPE.KNIGHT);
        this.showWP(cf.WP_TYPE.WATER_GUN)
        this.btnStart2 = ccs.load(res.btnStart2, "").node;
        this.btnStart2.setPosition(winSize.width/2+30, winSize.height/4);
        this.btnStart2.getChildByName("btn").addClickEventListener(() => {
            this.resetState();
            this.initCharStartGame();
            fr.view_with_args(GameLayer, true);
        });
        this.addChild(this.btnStart2);

        this.btnBack = ccui.Button(res.btnBack);
        this.btnBack.setPosition(50, winSize.height - this.btnBack.height/5*3);
        this.btnBack.addClickEventListener(()=>{
            fr.view(LobbyUI, 0.5 );
        });
        this.addChild(this.btnBack, 1, 'btnCalcel');
    },

    showInfo:function (ress, hp, mana , s) {
        if(this.infoNode != null){
            this.infoNode.removeFromParent(true);
            this.infoNode = null;
        }
        this.infoNode = ccs.load(res.infoNode, "").node;
        this.infoNode.setAnchorPoint(1, 0.5)
        this.infoNode.setPosition(0, winSize.height/2);
        let a = new cc.Sprite(ress);
        a.scale = 3;
        a.setPosition(this.infoNode.width/2+25, 340)
        this.infoNode.addChild(a);

        this.infoNode.getChildByName("numHp").setString(hp);
        this.infoNode.getChildByName("numMana").setString(mana);
        this.infoNode.getChildByName("numS").setString(s);
        this.infoNode.getChildByName("numCrit").setString(10);

        let pos = cc.p(this.infoNode.width, winSize.height/2)
        var seq = cc.sequence( cc.MoveTo(0.3, pos));
        this.infoNode.runAction(seq);
        this.addChild(this.infoNode);
    },

    initCharView:function () {
        this.charView = ccs.load(res.charInfo, "").node;
        this.charView.setPosition(winSize.width/2- 45, winSize.height/2 -90);

        this.addChild(this.charView);
        this.charUI =new cc.Layer();
        let knight = new cc.Sprite(res.knight1);
        knight.scale = 0.5;
        this.charUI.addChild(knight);
        this.charUI.setPosition(60, 85)
        let nameKnight = new ccui.Text("Knight", res.font_magic, 18);
        nameKnight.setPosition(3, 58);
        this.charUI.addChild(nameKnight);
        this.charView.getChildByName("scroll").addChild(this.charUI);

        this.arrowR = ccui.Button(res.arrowR);
        this.arrowR.setPosition(winSize.width/2+145, winSize.height/2);
        this.arrowR.addClickEventListener(()=>{
            this.showCharRight();
        });
        this.addChild(this.arrowR, 1);

        this.arrowL = ccui.Button(res.arrowL);
        this.arrowL.setPosition(winSize.width/2 - 90, winSize.height/2);
        this.arrowL.addClickEventListener(()=>{
            this.showCharLeft()
        });
        this.addChild(this.arrowL, 1);
    },

    getCharAndNameByInd:function () {
        let char;
        let name;
        let id = this.listChar[this.curIdx];
        switch (id)
        {
            case 1:
                char = new cc.Sprite(res.knight1);
                name = new ccui.Text("Knight", res.font_magic, 18);

                this.showInfo(res.knight, 7, 200, 6);
                this.showWP(cf.WP_TYPE.WATER_GUN);
                this.showSkill(cf.CHAR_TYPE.KNIGHT);
                break;
            case 2:
                char = new cc.Sprite(res.healer1);
                name = new ccui.Text("Healer", res.font_magic, 18);
                this.showInfo(res.healer, 5, 180, 7);
                this.showWP(cf.WP_TYPE.SHORT_GUN);
                this.showSkill(cf.CHAR_TYPE.HEALER);
                break;
            default:
                char = new cc.Sprite(res.knight1);
                name = new ccui.Text("Knight", res.font_magic, 18);
                this.showInfo(res.knight, 7, 200, 6);
                this.showWP(cf.WP_TYPE.WATER_GUN);
                this.showSkill(cf.CHAR_TYPE.KNIGHT);
                break;
        }

        char.scale = 0.5;
        return [char, name];
    },

    showCharLeft:function () {
        if(!this.isDone) return;
        this.curIdx--;
        if(this.curIdx < 0) this.curIdx = this.listChar.length-1;
        let [imgChar, nameChar] = this.getCharAndNameByInd();

        this.isDone = false;
        this.ind--;
        this.charUI.addChild(imgChar);
        imgChar.setPositionX(this.ind * 125);

        this.charUI.addChild(nameChar);
        nameChar.setPosition(this.ind * 125 + 3, 58);
        var scrollAction = cc.sequence(
            cc.moveBy(0.3, cc.p(125, 0)), cc.callFunc(()=>{
                this.isDone = true;
            })
        )
        this.charUI.runAction(scrollAction);
    },

    showCharRight:function () {
        if(!this.isDone) return;
        this.curIdx++;
        if(this.curIdx > this.listChar.length-1) this.curIdx = 0;
        let [imgChar, nameChar] = this.getCharAndNameByInd();

        this.isDone = false;
        this.ind++;
        this.charUI.addChild(imgChar);
        imgChar.setPositionX(this.ind * 125);
        this.charUI.addChild(nameChar);
        nameChar.setPosition(this.ind * 125+3, 58);
        var scrollAction = cc.sequence(
            cc.moveBy(0.3, cc.p(-125, 0)), cc.callFunc(()=>{
                this.isDone = true;
            })
        )
        this.charUI.runAction(scrollAction);
    },

    resetState:function (type) {
        SaveMap = {};
        CurMap = [4,1]
        SavePlayer = null;
        CurLvl = 1;
        Cur_Chapter = 1;
        Cur_Map = 1;
        CurDx = 0;
        CurDy = 1;
        SMALL_MAP = null;
    },

    initCharStartGame:function () {
        let id = this.listChar[this.curIdx];
        let wp = null;
        switch (id) {
            case cf.CHAR_TYPE.KNIGHT:
                SavePlayer = new Knight(this.mapView);
                wp = new WaterGun(SavePlayer.posLogic, SavePlayer._map);
                SavePlayer.initWPStart(wp)
                break;
            case cf.CHAR_TYPE.HEALER:
                SavePlayer = new Healer(this.mapView);
                wp = new ShortGun(SavePlayer.posLogic, SavePlayer._map);
                SavePlayer.initWPStart(wp)
                break;
            default:
                SavePlayer = new Knight(this.mapView);
                wp = new WaterGun(SavePlayer.posLogic, SavePlayer._map);
                SavePlayer.initWPStart(wp)
                break;
        }
        SavePlayer.initStatNewGame();
        SavePlayer.retain();

    },

    showSkill:function (type) {
        if(this.skillNode != null){
            this.skillNode.removeFromParent(true);
            this.skillNode = null;
        }

        this.skillNode = ccs.load(res.skillNodeUI, "").node;
        this.skillNode.setAnchorPoint(0, 0.5)
        this.skillNode.setPosition(winSize.width, winSize.height/2+this.skillNode.height/2);

        let str = "";
        if(type == cf.CHAR_TYPE.KNIGHT){
            str = "Tạo một bản sao của vũ khí đang dùng trong một khoảng thời gian.";
        }else if(type == cf.CHAR_TYPE.HEALER){
            str = "Tạo một vùng chữa trị trong một khoảng thời gian. Hồi máu cho đồng minh.";
        }
        this.skillNode.getChildByName("labelSkill").setString(str)
        let pos = cc.p(winSize.width - this.skillNode.width, winSize.height/2+this.skillNode.height/2)
        var seq = cc.sequence( cc.MoveTo(0.3, pos));
        this.skillNode.runAction(seq);
        this.addChild(this.skillNode);
    },

    showWP:function (type) {
        if(this.wpNode != null){
            this.wpNode.removeFromParent(true);
            this.wpNode = null;
        }

        this.wpNode = ccs.load(res.wpInfo, "").node;
        this.wpNode.setAnchorPoint(0, 0.5)
        this.wpNode.setPosition(winSize.width, winSize.height/2-this.wpNode.height/3*2);
        if(type == cf.WP_TYPE.WATER_GUN){
            this.wpNode.getChildByName("name").setString("Súng nước");

            let a = new cc.Sprite(res.gun);
            a.scale = 3;
            a.setPosition(this.wpNode.width/2-40, 70)
            this.wpNode.addChild(a);
        }else if(type == cf.WP_TYPE.SHORT_GUN){
            this.wpNode.getChildByName("name").setString("Súng chùm");

            let a = new cc.Sprite(res.shortgun);
            a.scale = 3;
            a.setPosition(this.wpNode.width/2-40, 70)
            this.wpNode.addChild(a);
        }

        this.wpNode.getChildByName("numMana").setString("0");

        let pos = cc.p(winSize.width - this.wpNode.width, winSize.height/2-this.wpNode.height/3*2)
        var seq = cc.sequence( cc.MoveTo(0.3, pos));
        this.wpNode.runAction(seq);
        this.addChild(this.wpNode);
    },




});

CharUI.scene = function () {
    var scene = new cc.Scene();
    var layer = new CharUI();
    scene.addChild(layer);
    return scene;
};
