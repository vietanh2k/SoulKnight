BackgroundLayerInstance = null

var BackgroundLayer = cc.Layer.extend({
    mapView: null,
    player: null,
    objectView: null,
    isTouchFire: false,
    xx: 0,
    yy: 0,
    isItemCanActive: false,
    state: 2,

    ctor: function() {
        this._super();
        BackgroundLayerInstance = this
        this.isItemCanActive = false;
        this.curItem = null;
        this.timeOnStart = 3;

        winSize = cc.director.getWinSize();
        var pos = this.convertIndexToPosLogic(2.1, 2.2)
        //
        let p1 = convertIndexToPosLogic(2.4, 3.4);
        let p2 = convertPosLogicToIntIdx(p1.x, p1.y);
        cc.log("test= "+p2.x+" "+p2.y)

        let mapKey = CurMap[0]+"-"+CurMap[1];
        this.player = SavePlayer;


        if(SaveMap.hasOwnProperty(mapKey)){
            cc.log('mmmmmmmmmmmmmmmm');
            let mapStatus = SaveMap[mapKey];
            MAP_WIDTH = mapStatus.mapW;
            MAP_HEIGHT = mapStatus.mapH;
            this.objectView = mapStatus.ojView;

            this.mapView = mapStatus._map;
            this.player._map = BackgroundLayerInstance.mapView;
            if(this.player.we != null){
                cc.log("111111111")
            }
            if(this.player.otherWeapon != null){
                cc.log("2222222222222")
            }
            this.addChild(this.player, 99);
            cc.log('3333333333')
            cc.log(this.player.x+" "+this.player.y)
            this.xx = cc.winSize.width/2;
            this.yy = cc.winSize.height/2;
            this.isTouchFire = false;
            this.initPosForPlayer();
            this.initMap()
            this.objectView.getObjectFromSave()
            return;
        }
        this.objectView = new ObjectView();
        let typeMap = ChapterMap[CurMap[0]][CurMap[1]];

        cc.log("Curmap==== "+CurMap[0]+" "+CurMap[1])
        cc.log("ChapterMap==== "+typeMap)
        switch (typeMap) {
            case GAME_CONFIG.HOME_STATE:
                this.createHomeMap();
                break;
            case GAME_CONFIG.ENEMY_STATE:
                CurLvl = Math.min(5, CurLvl + 0.4);     //tang level khi sang map moi
                this.createEnemyMap(CurLvl)
                break;
            case GAME_CONFIG.CHEST_STATE:
                this.createChestMap();
                break;
            case GAME_CONFIG.DES_STATE:
                this.createDesMap();
                break;
            case GAME_CONFIG.SPECIAL_STATE:
                this.randomSpecailMap();
                break;
            default:
                this.createEnemyMap(CurLvl)
                break;
        }
        // this.mapView = new MapView();
        // this.mapView.initFromJson(2);
        // this.mapView.findPathBFS(9,9, 3)
        if(SavePlayer === null) {
            SavePlayer = new Knight(pos, this.mapView);
            SavePlayer.retain();
            this.player = SavePlayer;
        }
        // this.player.posLogic = new cc.p(100, 100)
        this.player._map = BackgroundLayerInstance.mapView;
        this.initPosForPlayer();
        this.objectView.addChar(this.player);
        this.objectView.updateMap(this.mapView);
        this.xx = cc.winSize.width/2;
        this.yy = cc.winSize.height/2;
        this.isTouchFire = false;
        // this.p = new  Bullet(cc.p(200,200), this.mapView, cc.p(1,1))
        // this.objectView.addBullet(this.p);
        var poss = this.convertIndexToPosLogic(5, 2.2)
        let m = new Item(2, 1, poss);
        // this.addChild(m,999)
        // this.objectView.addItem(m)

        var poss2 = this.convertIndexToPosLogic(2.5, 2.5)
        // let m3 = new Item(10, 1, poss2, 3);
        // // this.addChild(m,999)
        // this.objectView.addItem(m3)
        let m2 = new ItemShop(1, 1, poss2, 26);
        // this.addChild(m,999)
        // this.objectView.addItemShop(m2)

        let m3 = new ItemShop(2, 1, poss, 26);
        // this.addChild(m,999)
        // this.objectView.addItemShop(m3)




        this.addChild(this.player, 99);
        // this.addChild(this.p)


        this.initMap()
        // angleTotal=0;
        //
        // var mainscene = ccs.load(res.paddleHp, "res/").node;
        //
        // this.addChild(mainscene,0,'scene');


    },

    activeItem: function(lvl) {
        this.curItem.activeItem();
    },

    randomSpecailMap: function(lvl) {
        let ran = Math.random();
        if(ran <= 0.25){
            this.createEnemyMap(CurLvl*3);
        }else {
            this.createShopMap();
        }
    },

    initPosForPlayer: function() {
        cc.log("CurDx= "+CurDx+" "+CurDy)
        var posMid = convertIndexToPosLogic(MAP_WIDTH/2, MAP_HEIGHT/2)
        var tmpMid = convertIndexToPosLogic(MAP_WIDTH/2-2, MAP_HEIGHT/2-2)
        let tmp = new cc.p(tmpMid.x*CurDx, tmpMid.y*CurDy);
        let posLogic2 = cc.pAdd(posMid, tmp);
        this.player.posLogic = posLogic2;
    },

    initMap: function() {
        let ba = new cc.Sprite(res.backback);
        ba.scale = 3;
        var posMid = convertIndexToPosLogic(MAP_WIDTH/2, MAP_HEIGHT/2);
        var posUI = cc.pMult(posMid, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        ba.setPosition(posUI)
        this.addChild(ba, -99999)
        for(var i=0; i <= MAP_WIDTH; i++){
            let object = this.addObjectUI(res.brick, i,0, 1);
            this.addChild(object, winSize.height - object.y, i+"-"+0);

            let object2 = this.addObjectUI(res.brick, i,MAP_HEIGHT, 1);
            this.addChild(object2, winSize.height - object2.y, i+"-"+MAP_HEIGHT);
        }
        for(var i=0; i <= MAP_HEIGHT; i++){
            let object = this.addObjectUI(res.brick, 0,i, 1);
            this.addChild(object, winSize.height - object.y, 0+"-"+i);

            let object2 = this.addObjectUI(res.brick, MAP_WIDTH,i, 1);
            this.addChild(object2, winSize.height - object2.y, MAP_WIDTH+"-"+i);
        }

        for(var i=1; i < MAP_WIDTH; i++){
            for(var j=MAP_HEIGHT-1; j> 0; j--){
                if(this.mapView.mapArray[i][j] == 1){
                    let object = this.addObjectUI(res.brick1, i,j, 1);
                    this.addChild(object, winSize.height - object.y, i+"-"+j);
                    // continue;
                }else if(this.mapView.mapArray[i][j] == GAME_CONFIG.MAP_BOX){
                    let object = this.addObjectUI(res.boxUI, i,j, 1);
                    this.addChild(object, winSize.height - object.y, i+"-"+j);
                    // continue;
                }else if(this.mapView.mapArray[i][j] == GAME_CONFIG.MAP_BOOMM1){
                    let object = this.addObjectUI(res.boomBox, i,j, 1);
                    this.addChild(object, winSize.height - object.y, i+"-"+j);
                    // continue;
                }else if(this.mapView.mapArray[i][j] == GAME_CONFIG.MAP_BOOMM2){
                    let object = this.addObjectUI(res.iceBox, i,j, 1);
                    this.addChild(object, winSize.height - object.y, i+"-"+j);
                    // continue;
                }else if(this.mapView.mapArray[i][j] == GAME_CONFIG.MAP_BOOMM3){
                    let object = this.addObjectUI(res.posionBox, i,j, 1);
                    this.addChild(object, winSize.height - object.y, i+"-"+j);
                    // continue;
                }

                var ran =  Math.floor(Math.random() * 5);
                if(ran === 0){
                    let object = this.addObjectUI(res.celll0, i,j, 1);
                    this.addChild(object, -9999);
                    continue;
                }
                if(ran === 1){
                    let object = this.addObjectUI(res.celll1, i,j, 1);
                    this.addChild(object, -9999);
                    continue;
                }
                if(ran === 2){
                    let object = this.addObjectUI(res.celll2, i,j, 1);
                    this.addChild(object, -9999);
                    continue;
                }
                if(ran === 3){
                    let object = this.addObjectUI(res.celll3, i,j, 1);
                    this.addChild(object, -9999);
                    continue;
                }
                if(ran === 4){
                    let object = this.addObjectUI(res.celll4, i,j, 1);
                    this.addChild(object, -9999);
                    continue;
                }

            }
        }
    },

    delBoxUi: function(dx, dy) {
        this.getChildByName(dx+"-"+dy).removeFromParent(true);
    },

    addObjectUI: function (_res, corX, corY, _scale) {
        var object = new cc.Sprite(_res)
        object.setScale(_scale * CELL_SIZE_UI / object.getContentSize().width)
        var pos = this.convertIndexToPosUI(corX, corY)
        object.setPosition(pos)
        return object
    },

    convertIndexToPosUI: function (corX, corY) {
        var x, y
        x = corX * CELL_SIZE_UI + CELL_SIZE_UI/2
        y = corY * CELL_SIZE_UI + CELL_SIZE_UI/2

        return new cc.p(x, y)
    },

    convertIndexToPosLogic: function (corX, corY) {
        var x, y
        x = corX * GAME_CONFIG.CELLSIZE + GAME_CONFIG.CELLSIZE/2
        y = corY * GAME_CONFIG.CELLSIZE + GAME_CONFIG.CELLSIZE/2

        return new cc.p(x, y)
    },

    update: function(dt) {
        if(this.state === GAME_CONFIG.STATE_ONSTART){
            this.timeOnStart -= dt;
            if(this.timeOnStart <= 0){
                this.state = GAME_CONFIG.STATE_FIGHTING;
            }
        }
        this.objectView.update(dt);
        // if(this.player.posLogic.x >=GAME_CONFIG.CELLSIZE*MAP_WIDTH/4 && this.player.posLogic.x <= GAME_CONFIG.CELLSIZE*MAP_WIDTH/4*3) {
            this.x = -(this.player.x - this.xx);
        // }
        // if(this.player.posLogic.y >=GAME_CONFIG.CELLSIZE*MAP_HEIGHT/4 && this.player.posLogic.y <= GAME_CONFIG.CELLSIZE*MAP_HEIGHT/4*3) {
            this.y = -(this.player.y - this.yy);
        // }
    },

    fireBullet: function() {
        var bullet = this.player.createBullet()
        this.objectView.addBullet(bullet)

    },

    setTouchFireState: function(state) {
        this.isTouchFire = state;

    },

    createMapByLvl: function(lvl) {
        let ranMap = Math.floor(Math.random()*5);
        let maxLvlEnemy = Math.ceil(lvl);
        this.mapView = new MapView();
        this.mapView.initFromJson(ranMap);

        let lis = [];
        let a = this.calculateLevelMap(lvl);
        for(var i=0; i<cf.MAP_LEVEL.length; i++){
            if(a < cf.MAP_LEVEL[i].level){
                lis = cf.MAP_LEVEL[i].enemy;
                break;
            }
        }

        return lis;

    },

    createEnemyMap: function(lvl) {
        cc.log("curLvl ==== "+CurLvl)
        this.state = GAME_CONFIG.STATE_ONSTART;
        let lis = this.createMapByLvl(lvl);

        for(let i=0; i<lis.length; i++){
            var pos2 = this.convertIndexToPosLogic(7, 9)
            if(lis[i]===1){
                let ran = Math.floor(Math.random()*2);
                if(ran === 0){
                    let enemy = new Melee1(pos2, this.mapView);
                    this.objectView.addEnemy(enemy);
                }
                if(ran === 1){
                    let enemy = new Range1(pos2, this.mapView);
                    this.objectView.addEnemy(enemy);
                }
            }else{
                let ran = Math.floor(Math.random()*2);
                if(ran === 0){
                    let enemy = new Range2(pos2, this.mapView);
                    this.objectView.addEnemy(enemy);
                }
                if(ran === 1){
                    let enemy = new Melee2(pos2, this.mapView);
                    this.objectView.addEnemy(enemy);
                }
            }
        }

    },

    createHomeMap: function() {
        this.state = GAME_CONFIG.STATE_MOVING;
        this.mapView = new MapView();
        this.mapView.initChestMap();
        this.initDoor();
    },

    createChestMap: function() {
        this.state = GAME_CONFIG.STATE_MOVING;
        this.mapView = new MapView();
        this.mapView.initChestMap();

        var posMid = this.convertIndexToPosLogic(MAP_WIDTH/2, MAP_HEIGHT/2)
        let chest = new Item(GAME_CONFIG.ITEM_CHEST, 1, posMid);
        BackgroundLayerInstance.objectView.addItem(chest)
        this.initDoor();
    },

    createDesMap: function() {
        if(Cur_Map >= 5){
            this.createBossMap();
            return;
        }
        this.state = GAME_CONFIG.STATE_MOVING;
        this.mapView = new MapView();
        this.mapView.initDesMap();
        this.initDoor();
        this.initDoorNewChap();

    },

    createBossMap: function() {
        this.state = GAME_CONFIG.STATE_ONSTART;
        this.mapView = new MapView();
        this.mapView.initBossMap();
        var pos2 = this.convertIndexToPosLogic(MAP_WIDTH/2, MAP_HEIGHT/4*3)
        let boss = new Boss(pos2, this.mapView);
        this.objectView.addEnemy(boss);

    },

    createShopMap: function() {
        this.state = GAME_CONFIG.STATE_MOVING;
        this.mapView = new MapView();
        this.mapView.initShopMap();

        var pos = this.convertIndexToPosLogic(MAP_WIDTH/7*2, MAP_HEIGHT/2.1)

        let smallHp = new ItemShop(GAME_CONFIG.ITEM_POTION, 1, pos, 10);
        BackgroundLayerInstance.objectView.addItemShop(smallHp)

        var pos2 = this.convertIndexToPosLogic(MAP_WIDTH/7*3, MAP_HEIGHT/2.1)

        let smallMana = new ItemShop(GAME_CONFIG.ITEM_POTION, 2, pos2, 10);
        BackgroundLayerInstance.objectView.addItemShop(smallMana)

        var pos3 = this.convertIndexToPosLogic(MAP_WIDTH/7*4, MAP_HEIGHT/2.1)

        let wp1 = new ItemShop(GAME_CONFIG.ITEM_WEAPON, 2, pos3, 10);
        BackgroundLayerInstance.objectView.addItemShop(wp1)

        var pos4 = this.convertIndexToPosLogic(MAP_WIDTH/7*5, MAP_HEIGHT/2.1)

        let wp2 = new ItemShop(GAME_CONFIG.ITEM_WEAPON, 1, pos4, 10);
        BackgroundLayerInstance.objectView.addItemShop(wp2)

        this.initDoor();
    },

    calculateLevelMap: function(lvl) {
        let a = (MAP_HEIGHT*MAP_WIDTH+MAP_HEIGHT+MAP_WIDTH)/(MAP_HEIGHT*MAP_WIDTH);
        let b = 1 - (MAP_BLOCK+1) / (MAP_HEIGHT*MAP_WIDTH);
        let c = Math.sqrt(a) * Math.pow(b, 4);
        let e = 1/c*10*lvl;
        return e;
    },

    initDoor:function () {
        let tmp1 = new cc.p(CurMap[0], CurMap[1]);
        var posMid = this.convertIndexToPosLogic(MAP_WIDTH/2, MAP_HEIGHT/2)
        var tmpMid = this.convertIndexToPosLogic(MAP_WIDTH/2-2, MAP_HEIGHT/2-2)
        for(var i =0;i <DX.length; i++){
            let x = CurMap[0] + DX[i];
            let y = CurMap[1] + DY[i];
            if(ChapterMap[x][y] >= 0){
                cc.log("door "+x+" "+y);
                SMALL_MAP.showNewMap(x,y);
                let a = new ccui.Button(res.gold);
                let tmp = new cc.p(tmpMid.x*DX[i], tmpMid.y*DY[i]);
                let posLogic = cc.pAdd(posMid, tmp);
                let gateId = [x, y];

                let item = new Item(GAME_CONFIG.ITEM_GATE, cf.GATE_TYPE.NEXT_MAP, posLogic);
                item.updateGateId(gateId);
                this.objectView.addItem(item);
            }
        }
    },

    initDoorNewChap:function () {
        var posMid = this.convertIndexToPosLogic(MAP_WIDTH/2, MAP_HEIGHT/2)
        let gateId = [0, 0];

        let item = new Item(GAME_CONFIG.ITEM_GATE, cf.GATE_TYPE.NEXT_CHAPTER, posMid);
        // item.runAction(cc.RotateBy(1,360).repeatForever())
        item.updateGateId(gateId);
        this.objectView.addItem(item);
    },


});
