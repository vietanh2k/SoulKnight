BackgroundLayerInstance = null

var BackgroundLayer = cc.Layer.extend({
    mapView: null,
    player: null,
    objectView: null,
    isTouchFire: false,
    xx: 0,
    yy: 0,
    isItemCanActive: false,

    ctor: function() {
        this._super();
        BackgroundLayerInstance = this
        this.isItemCanActive = false;
        this.curItem = null;

        winSize = cc.director.getWinSize();
        var pos = this.convertIndexToPosLogic(2.1, 2.2)

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
            this.addChild(this.player);
            cc.log('3333333333')
            cc.log(this.player.x+" "+this.player.y)
            this.xx = cc.winSize.width/2;
            this.yy = cc.winSize.height/2;
            this.isTouchFire = false;
            this.player.posLogic = new cc.p(100, 100)
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
                this.createEnemyMap(2)
                break;
            case GAME_CONFIG.ENEMY_STATE:
                this.createEnemyMap(2)
                break;
            case GAME_CONFIG.CHEST_STATE:
                this.createChestMap();
                break;
            case GAME_CONFIG.DES_STATE:
                this.createDesMap();
                break;
            default:
                this.createEnemyMap(2)
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
        this.player.posLogic = new cc.p(100, 100)
        this.player._map = BackgroundLayerInstance.mapView;

        this.objectView.addChar(this.player);
        this.objectView.updateMap(this.mapView);
        this.xx = cc.winSize.width/2;
        this.yy = cc.winSize.height/2;
        this.isTouchFire = false;
        // this.p = new  Bullet(cc.p(200,200), this.mapView, cc.p(1,1))
        // this.objectView.addBullet(this.p);
        var poss = this.convertIndexToPosLogic(2.1, 2.2)
        let m = new Item(2, 1, poss);
        // this.addChild(m,999)
        this.objectView.addItem(m)

        var poss2 = this.convertIndexToPosLogic(2.5, 2.5)
        let m2 = new Item(1, 1, poss2);
        // this.addChild(m,999)
        this.objectView.addItem(m2)



        this.addChild(this.player);
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

    activeItemWeapon: function(lvl) {
        cc.log("wp")
    },

    activeItemPotion: function(lvl) {

    },

    activeItemGate: function(lvl) {

    },

    initMap: function() {
    cc.log("init mappppppppppp"+MAP_WIDTH+" "+MAP_HEIGHT)
        for(var i=0; i <= MAP_WIDTH; i++){
            for(var j=0; j<= MAP_HEIGHT; j++){
                if(this.mapView.mapArray[i][j] == 1){
                    this.addObjectUI(res.brick, i,j, 1);
                    continue;
                }
                var ran =  Math.floor(Math.random() * 20);
                if(ran === 0 || ran > 2){
                    this.addObjectUI(res.celll0, i,j, 1);
                    continue;
                }
                if(ran === 1){
                    this.addObjectUI(res.celll1, i,j, 1);
                    continue;
                }
                if(ran === 2){
                    this.addObjectUI(res.celll2, i,j, 1);
                    continue;
                }

            }
        }
    },

    addObjectUI: function (_res, corX, corY, _scale) {
        var object = new cc.Sprite(_res)
        object.setScale(_scale * CELL_SIZE_UI / object.getContentSize().height)
        var pos = this.convertIndexToPosUI(corX, corY)
        object.setPosition(pos)
        cc.log("posUI "+pos.x+" "+pos.y)
        this.addChild(object, -1)
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
        let lis = this.createMapByLvl(lvl);

        for(let i=0; i<lis.length; i++){
            var pos2 = this.convertIndexToPosLogic(7, 9)
            if(lis[i]===1){
                let ran = Math.floor(Math.random()*2);
                if(ran === 0){
                    let enemy = new Range1(pos2, this.mapView);
                    this.objectView.addEnemy(enemy);
                }
                if(ran === 1){
                    let enemy = new Melee1(pos2, this.mapView);
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

    createChestMap: function() {
        this.mapView = new MapView();
        this.mapView.initChestMap();
        this.initDoor();

    },

    createDesMap: function() {
        this.mapView = new MapView();
        this.mapView.initDesMap();
        this.initDoor();
        this.initDoorNewChap();

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
                let a = new ccui.Button(res.gold);
                let tmp = new cc.p(tmpMid.x*DX[i], tmpMid.y*DY[i]);
                let posLogic = cc.pAdd(posMid, tmp);
                let gateId = [x, y];

                let item = new Item(GAME_CONFIG.ITEM_GATE, 1, posLogic);
                item.updateGateId(gateId);
                this.objectView.addItem(item);
            }
        }
    },

    initDoorNewChap:function () {
        var posMid = this.convertIndexToPosLogic(MAP_WIDTH/2, MAP_HEIGHT/2)
        let gateId = [0, 0];

        let item = new Item(GAME_CONFIG.ITEM_GATE, 1, posMid);
        item.updateGateId(gateId);
        this.objectView.addItem(item);
    },


});
