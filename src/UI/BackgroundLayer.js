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
        this.timeOnStart = 4.5;

        winSize = cc.director.getWinSize();
        let mapKey = CurMap[0]+"-"+CurMap[1];
        this.player = SavePlayer;


        if(SaveMap.hasOwnProperty(mapKey)){
            let mapStatus = SaveMap[mapKey];
            MAP_WIDTH = mapStatus.mapW;
            MAP_HEIGHT = mapStatus.mapH;
            this.objectView = mapStatus.ojView;

            this.mapView = mapStatus._map;
            this.player._map = BackgroundLayerInstance.mapView;
            this.addChild(this.player, 99);

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

        switch (typeMap) {
            case GAME_CONFIG.HOME_STATE:
                this.createChestMap();
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

        if(SavePlayer === null) {
            SavePlayer = new Healer(this.mapView);
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

        this.addChild(this.player, 99);
        this.initMap()

    },

    activeItem: function() {
        this.curItem.activeItem();
    },

    randomSpecailMap: function(lvl) {
        let ran = Math.random();
        if(ran <= 0){
            let lvl = Math.min(5, CurLvl*3)
            this.createEnemyMap(lvl);
        }else {
            this.createShopMap();
        }
    },

    initPosForPlayer: function() {
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
            this.addChild(object, winSize.height - object.y + CELL_SIZE_UI/2, i+"-"+0);

            let object2 = this.addObjectUI(res.brick, i,MAP_HEIGHT, 1);
            this.addChild(object2, winSize.height - object2.y + CELL_SIZE_UI/2, i+"-"+MAP_HEIGHT);
        }
        for(var i=0; i <= MAP_HEIGHT; i++){
            let object = this.addObjectUI(res.brick, 0,i, 1);
            this.addChild(object, winSize.height - object.y + CELL_SIZE_UI/2, 0+"-"+i);

            let object2 = this.addObjectUI(res.brick, MAP_WIDTH,i, 1);
            this.addChild(object2, winSize.height - object2.y + CELL_SIZE_UI/2, MAP_WIDTH+"-"+i);
        }

        for(var i=1; i < MAP_WIDTH; i++){
            for(var j=MAP_HEIGHT-1; j> 0; j--){
                if(this.mapView.mapArray[i][j] == 1){
                    let object = this.addObjectUI(res.brick1, i,j, 1);
                    this.addChild(object, winSize.height - object.y + CELL_SIZE_UI/2, i+"-"+j);
                    // continue;
                }else if(this.mapView.mapArray[i][j] == GAME_CONFIG.MAP_BOX){
                    let object = this.addObjectUI(res.boxUI, i,j, 1);
                    this.addChild(object, winSize.height - object.y + CELL_SIZE_UI/2, i+"-"+j);
                    // continue;
                }else if(this.mapView.mapArray[i][j] == GAME_CONFIG.MAP_BOOMM1){
                    let object = this.addObjectUI(res.boomBox, i,j, 1);
                    this.addChild(object, winSize.height - object.y + CELL_SIZE_UI/2, i+"-"+j);
                    // continue;
                }else if(this.mapView.mapArray[i][j] == GAME_CONFIG.MAP_BOOMM2){
                    let object = this.addObjectUI(res.iceBox, i,j, 1);
                    this.addChild(object, winSize.height - object.y + CELL_SIZE_UI/2, i+"-"+j);
                    // continue;
                }else if(this.mapView.mapArray[i][j] == GAME_CONFIG.MAP_BOOMM3){
                    let object = this.addObjectUI(res.posionBox, i,j, 1);
                    this.addChild(object, winSize.height - object.y + CELL_SIZE_UI/2, i+"-"+j);
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
        if(this.getChildByName(dx+"-"+dy) != null) {
            this.getChildByName(dx + "-" + dy).removeFromParent(true);
        }
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

    initStartPos: function () {
        if(!this.initStart) {
            this.initStart = true;
            var posMid = this.convertIndexToPosLogic(MAP_WIDTH / 2, MAP_HEIGHT / 2);
            var posUI = cc.pMult(posMid, (CELL_SIZE_UI / GAME_CONFIG.CELLSIZE));
            this.x = -(posUI.x - this.xx);
            this.y = -(posUI.y - this.yy);
        }
    },

    moveWindowToPosObj: function (speed, objX, objY) {
        if(isNaN(objX) || isNaN(objY)) return;
        let p1 = cc.p(this.x, this.y);
        let p2 = cc.p(-(objX - this.xx), -(objY - this.yy));
        let pSub = cc.pSub(p2, p1);
        let dis = cc.pDistance(p1, p2);
        let t = 1
        if(dis !== 0) {
            t = Math.min(1, speed/dis);
            // t = i / dis;     // t tu 0 toi 1

        }
        let curP = new cc.p(p1.x + pSub.x*t, p1.y + pSub.y*t);
        this.x = curP.x;
        this.y = curP.y;
        if(t == 1) return true;

        return false;
    },

    update: function(dt) {
        if(this.state === GAME_CONFIG.STATE_ONSTART){
            this.timeOnStart -= dt;
            if(this.timeOnStart <= 0){
                this.state = GAME_CONFIG.STATE_FIGHTING;
            }

        }
        this.objectView.update(dt);
        if(this.state === GAME_CONFIG.STATE_ONSTART){
            this.initStartPos();
        }else{
            this.moveWindowToPosObj(10, this.player.x, this.player.y)
        }
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
        this.state = GAME_CONFIG.STATE_ONSTART;
        let lis = this.createMapByLvl(lvl);

        let listPosNoneBlock = this.mapView.getListPosNoneBlock();
        this.timeOnStart = 3.3 + 0.2*lis.length;

        setTimeout(()=>{
            let ready = new cc.Sprite(res.ready);
            ready.setPosition(winSize.width/2, winSize.height/2);
            GamelayerInstance.addChild(ready, 1);
            ready.scale = 0.7
            let seq = cc.sequence(cc.fadeIn(0.3));
            let seq2 = cc.sequence(cc.scaleBy(0.4, 1/0.7), cc.delayTime(0.7), cc.callFunc(()=>{
                ready.removeFromParent(true);
            }));
            ready.runAction(seq);
            ready.runAction(seq2);

            setTimeout(()=>{
                let fight = new cc.Sprite(res.fight);
                fight.setPosition(winSize.width/2, winSize.height/2);
                GamelayerInstance.addChild(fight, 1);
                fight.scale = 0.7
                let seq3 = cc.sequence(cc.fadeIn(0.15), cc.delayTime(0.4), cc.fadeOut(0.3));
                let seq4 = cc.sequence(cc.scaleBy(0.2, 1/0.7), cc.delayTime(0.5), cc.callFunc(()=>{
                    fight.removeFromParent(true);
                }));
                fight.runAction(seq3)
                fight.runAction(seq4)
                }, 1000)
        }, 1500 + lis.length*200)



        for(let i=0; i<lis.length; i++){
            if(listPosNoneBlock.length <= 0) return;

            setTimeout(()=>{
                let ran = Math.floor(Math.random()*listPosNoneBlock.length);
                var pos2 = this.convertIndexToPosLogic(listPosNoneBlock[ran][0], listPosNoneBlock[ran][1]);
                listPosNoneBlock.splice(ran, 1);
                this.appearSmoke(pos2);

                setTimeout(()=>{
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
                }, 300)
            }, 1000 + i*200);



        }


    },

    createHomeMap: function() {
        this.state = GAME_CONFIG.STATE_MOVING;
        this.mapView = new MapView();
        this.mapView.initChestMap();
        setTimeout(()=>{
            this.initAppear();
        }, 1700)
        setTimeout(()=>{
            this.initDoor();
        }, 2000)
    },

    createChestMap: function() {
        this.state = GAME_CONFIG.STATE_MOVING;
        this.mapView = new MapView();
        this.mapView.initChestMap();

        var posMid = this.convertIndexToPosLogic(MAP_WIDTH/2, MAP_HEIGHT/2)
        let chest = new Item(GAME_CONFIG.ITEM_CHEST, 1, posMid);
        BackgroundLayerInstance.objectView.addItem(chest)
        setTimeout(()=>{
            this.initAppear();
        }, 1700)
        setTimeout(()=>{
            this.initDoor();
        }, 2000)
    },

    createDesMap: function() {
        if(Cur_Map >= LVL_BOSS){
            this.createBossMap();
            return;
        }
        this.state = GAME_CONFIG.STATE_MOVING;
        this.mapView = new MapView();
        this.mapView.initDesMap();
        setTimeout(()=>{
            this.initAppear();
        }, 1700)
        setTimeout(()=>{
            this.initDoor();
        }, 2000)
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

        let wpSize = Object.keys(cf.WP_TYPE).length;
        let ran = Math.floor((Math.random() * wpSize) + 1);

        let wp1 = new ItemShop(GAME_CONFIG.ITEM_WEAPON, ran, pos3, 10);
        BackgroundLayerInstance.objectView.addItemShop(wp1)

        var pos4 = this.convertIndexToPosLogic(MAP_WIDTH/7*5, MAP_HEIGHT/2.1)
        let ran2 = Math.floor((Math.random() * wpSize) + 1);
        let wp2 = new ItemShop(GAME_CONFIG.ITEM_WEAPON, ran2, pos4, 10);
        BackgroundLayerInstance.objectView.addItemShop(wp2)

        setTimeout(()=>{
            this.initAppear();
        }, 1700)
        setTimeout(()=>{
            this.initDoor();
        }, 2000)
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

    initAppear:function () {
        var posMid = this.convertIndexToPosLogic(MAP_WIDTH/2, MAP_HEIGHT/2)
        var tmpMid = this.convertIndexToPosLogic(MAP_WIDTH/2-2, MAP_HEIGHT/2-2)
        for(var i =0;i <DX.length; i++){
            let x = CurMap[0] + DX[i];
            let y = CurMap[1] + DY[i];
            if(ChapterMap[x][y] >= 0){
                let tmp = new cc.p(tmpMid.x*DX[i], tmpMid.y*DY[i]);
                let posLogic = cc.pAdd(posMid, tmp);
                var posUI = cc.pMult(posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
                let ap = new Appear(posUI, CELL_SIZE_UI);
                BackgroundLayerInstance.addChild(ap, winSize.height);


            }
        }
    },

    appearSmoke:function (posLogic) {
        var posUI = cc.pMult(posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        let ap = new Appear(posUI, CELL_SIZE_UI);
        BackgroundLayerInstance.addChild(ap, winSize.height);
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
