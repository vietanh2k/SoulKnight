MAP_WIDTH = 7;
MAP_HEIGHT = 5;
MAP_RATIO = 15/8;

var GameUI = cc.Layer.extend({
    mapWidth: null,
    mapHeight: null,
    cellWidth: null,
    healthA: null,
    _gameStateManager:null,
    createObjectByTouch:null,
    deleteObjectByTouch:null,

    ctor:function (pkg) {
        cc.spriteFrameCache.addSpriteFrames(res.darkgiant_plist, res.darkgiant_png);
        cc.spriteFrameCache.addSpriteFrames(res.ninja_plist, res.ninja_png);
        this.createObjectByTouch = false
        this.deleteObjectByTouch = false
        this._super();
        this._gameStateManager = new GameStateManager(pkg)
        this.init();
        this.scheduleUpdate();

    },
    init:function () {

        winSize = cc.director.getWinSize();

        this.initBackGround();
        this.initCellSlotMapA(this._gameStateManager.playerA._map._mapController.intArray, this._gameStateManager.playerA.rule)
        this.initCellSlotMapA(this._gameStateManager.playerB._map._mapController.intArray, this._gameStateManager.playerB.rule)
        this.showPathUI(this._gameStateManager.playerA._map._mapController.path, 1)
        this.showPathUI(this._gameStateManager.playerB._map._mapController.path, 2)
        // cc.log(this._gameStateManager.playerA._map.monsters[0])
        this.addChild(this._gameStateManager.playerA._map.monsters[0],1003)
        // this._gameStateManager.playerA._map.monsters[0].updateCurNode()
        // this._gameStateManager.playerA._map.monsters[0].updateDes()

        // this.schedule(this.update, 0.1);
        // var map = new MapController(this)
        this.addTouchListener()



        return true;
    },
    addTouchListener:function(){
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            // swallowTouches: true,
            onTouchBegan: function (touch, event){
                cc.log("touch began2: "+ touch.getLocationX());
                MW.MOUSE.x = touch.getLocationX();
                MW.MOUSE.y = touch.getLocationY();
                MW.TOUCH = true;
                return true;

            }

        } , this);
    },
    checkTouchRight: function (){
        if(MW.TOUCH){
            MW.TOUCH = false
            var pos = new cc.p(MW.MOUSE.x, MW.MOUSE.y)
            var loc = this._gameStateManager.playerA.convertPosToCor(pos)
            cc.log(loc.x+'---'+loc.y)
            if(this._gameStateManager.playerA._map._mapController.intArray[loc.x][loc.y] <= 0 ) {
                cc.log('touch right')
                this.createObjectByTouch = true
            }else if(this._gameStateManager.playerA._map._mapController.intArray[loc.x][loc.y] > 0 ){
                this.deleteObjectByTouch = true
            }
        }

    },

    createObjectByTouch2: function (){
        if(this.createObjectByTouch ){
            this.createObjectByTouch = false
            cc.log('creat right')
            var pos = new cc.p(MW.MOUSE.x, MW.MOUSE.y)
            var loc = this._gameStateManager.playerA.convertPosToCor(pos)
            var rand = Math.floor(Math.random() * 2)+1;
            this._gameStateManager.playerA._map._mapController.intArray[loc.x][loc.y] = rand
            if(!this.isNodehasMonsterAbove(loc)){
                this._gameStateManager.playerA._map._mapController.findPath()
                this.showPathUI(this._gameStateManager.playerA._map._mapController.path)
                this.addObjectUI(res.treeUI, loc.x, loc.y, 0, 1)

                // }else{
                //     this.arr[loc.x][loc.y] = 0
            }


        }

    },
    isNodehasMonsterAbove:function (loc){

        var children = this.children
        for (i in children) {
            if(children[i]._curNode != undefined ){
                var monsterLocArr = children[i]._curNode.split('-');
                var monsterLoc = new cc.p(parseInt(monsterLocArr[0]), parseInt(monsterLocArr[1]));
                if(monsterLoc.x == loc.x && monsterLoc.y == loc.y){
                    return true
                }
            }
        }

        return false
    },


    showPathUI:function (path, rule){
        while(this.getChildByName(res.highlightPath+rule) != null){
            this.removeChild(this.getChildByName(res.highlightPath+rule))
        }
        while(this.getChildByName(res.iconArrow+rule) != null){
            this.removeChild(this.getChildByName(res.iconArrow+rule))
        }
        var nodeX = 0
        var nodeY = 0
        var count = 0
        while(nodeX != MAP_WIDTH || nodeY != MAP_HEIGHT){
            var dir = path[nodeX+'-'+nodeY].direc
            this.addBuffUI(res.highlightPath,nodeX,nodeY,rule)
            this.addObjectUI(res.iconArrow,nodeX,nodeY,dir,rule)
            if(this.getChildByName(res.iconArrow+'2') != null) {
                cc.log('llllllllllllllllllllllll')
                this.getChildByName(res.iconArrow + '2').setFlippedX(true)
                this.getChildByName(res.iconArrow + '2').setFlippedY(true)
            }
            var parent = path[nodeX+'-'+nodeY].parent
            var parentList = parent.split('-');
            nodeX = parseInt(parentList[0])
            nodeY = parseInt(parentList[1])
            count++
            if(count>100) break
        }
    },

    initBackGround:function()
    {
        var backg0 = new cc.Sprite(res.mapbackground00);
        backg0.setAnchorPoint(0,0)
        backg0.setScaleY(winSize.height/backg0.getContentSize().height)
        backg0.setScaleX(winSize.width/backg0.getContentSize().width)
        this.addChild(backg0);

        this.addObjectBackground(res.river0,1,0,0,1/15)
        this.addObjectBackground(res.river1,1,0,0,1/15)
        this.addObjectBackground(res.mapbackground03,0,6/15,0.01,-2.5/15)
        this.addObjectBackground(res.mapbackground02,0,6/15,0,4.5/15)
        this.addObjectBackground(res.cell_start2,1/8,0,-3/8,1/15)
        this.addObjectBackground(res.cell_start2,1/8,0,-2/8,1/15)
        this.addObjectBackground(res.cell_start1,1/8,0,3/8,1/15)
        this.addObjectBackground(res.cell_start1,1/8,0,2/8,1/15)

        this.addObjectBackground(res.mapbackground01,7/8,0,0,-2/15)
        this.addObjectBackground(res.mapbackground0,7/8,0,0,4/15)
        this.addObjectBackground(res.gridui,7/8,0,0,4/15)
        this.addObjectBackground(res.gridui,7/8,0,0,-2/15)
        this.addObjectBackground(res.grid1,2/8,0,-2.5/8,0.5/15)
        this.addObjectBackground(res.grid2,2/8,0,2.5/8,1.5/15)

        this.addObjectBackground(res.gate2,1.5/8,0,-2.1/8,1.1/15)
        this.addObjectBackground(res.gate1,1.5/8,0,2.1/8,1.1/15)


        this.addObjectBackground(res.rock4,1/8.5,0,-6/15,7/15)
        this.addObjectBackground(res.grass3,1/7,0,8.5/15,6.5/15)
        this.addObjectBackground(res.grass2,1/15,0,8.7/15,6.3/15)
        this.addObjectBackground(res.tree0,1/5,0,8/15,5.5/15)
        this.addObjectBackground(res.rock0,1/9,0,8/15,4.2/15)
        this.addObjectBackground(res.tree2,1/3,0,8/15,3.5/15)
        this.addObjectBackground(res.tree1,1/5,0,7/15,7.5/15)
        this.addObjectBackground(res.tree3,1/5,0,5.5/15,7.5/15)
        this.addObjectBackground(res.grass1,1/10,0,-7.7/15,5.3/15)
        this.addObjectBackground(res.tree1,1/5,0,-8.2/15,4.5/15)
        this.addObjectBackground(res.tree3,1/6,0,-8/15,3.5/15)
        this.addObjectBackground(res.grass0,1/12,0,-2.2/15,7/15)
        this.addObjectBackground(res.tree0,1/5.5,0,-3.2/15,7.5/15)
        this.addObjectBackground(res.tree2,1/3.5,0,-4.5/15,7.5/15)
        this.addObjectBackground(res.rock3,1/7,0,-0.2/15,7/15)
        this.addObjectBackground(res.grass1,1/11,0,3.5/15,7/15)

        this.addObjectBackground(res.decorate,0,2.2/15,9/15,1/15)
        this.addObjectBackground(res.decorate1,0,2.3/15,-8.15/15,1.25/15)
        this.addObjectBackground(res.grass1,1/11,0,-8/15,-1.5/15)
        this.addObjectBackground(res.tree0,1/4,0,-8.5/15,-0.5/15)

        this.addObjectBackground(res.rock3,1/8,0,-8.5/15,-2/15)
        this.addObjectBackground(res.tree1,1/5,0,-8.5/15,-2.6/15)


        this.addObjectBackground(res.grass1,1/10,0,3.5/15,-5/15)
        this.addObjectBackground(res.grass1,1/10,0,-7.5/15,-4.5/15)
        this.addObjectBackground(res.tree2,1/5,0,-8/15,-5/15)
        this.addObjectBackground(res.grass1,1/11,0,8/15,0.1/15)
        this.addObjectBackground(res.tree1,1/5,0,8.5/15,-0.5/15)
        this.addObjectBackground(res.grass0,1/10,0,8/15,-2.8/15)
        this.addObjectBackground(res.rock3,1/6,0,9/15,-3.3/15)
        this.addObjectBackground(res.tree2,1/5,0,8.5/15,-1.5/15)
        this.addObjectBackground(res.rock4,1/7,0,-8.5/15,-4/15)
        this.addObjectBackground(res.tree2,1/3.5,0,8.8/15,-4.5/15)
        this.addObjectBackground(res.tree1,1/3.7,0,-6/15,-5.6/15)

        this.addObjectBackground(res.house,1/6.5,0,-3.9/8,6.2/15)
        this.addObjectBackground(res.house,1/6.5,0,3.9/8,-3.8/15)
        this.addObjectBackground(res.deck,0,2.9/15,0,-6.05/15)
        // this.healthA = new ccui.Text(this._gameStateManager.playerA.health, res.font_magic, 30)
        this.healthA = new ccui.Text(10, res.font_magic, 30)
        this.healthA.setScale(WIDTHSIZE/this.healthA.getContentSize().width*1/15)
        this.healthA.setPosition(winSize.width/2 + WIDTHSIZE*3.9/8, winSize.height/2+HEIGHTSIZE*-3.8/15)
        var blueColor = new cc.Color(255,255,255,255);
        this.healthA.setTextColor(blueColor)
        this.addChild(this.healthA)

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

    convertCordinateToPos:function (corX, corY) {
        var x = winSize.width/2 - WIDTHSIZE/2 + (corX+1)*this.cellWidth
        var y = winSize.height/2 - HEIGHTSIZE/2 + (MAP_HEIGHT- corY+3.5)*this.cellWidth
        var p = new cc.p(x,y)
        return p

    },

    convertPosToCor:function (pos) {
        var x = Math.floor((pos.x - winSize.width/2 + WIDTHSIZE/2 )/this.cellWidth - 0.5)
        var y = Math.floor((pos.y - winSize.height/2+HEIGHTSIZE/2)/this.cellWidth)
        var p = new cc.p(x,y)
        return p

    },

    initCellSlotMapA:function ( mapArray, rule) {
        var arr = this._gameStateManager.playerA._map._mapController.intArray
        for(var i=0;i<MAP_WIDTH+1;i++){
            for(var j=0; j <MAP_HEIGHT+1; j++){
                if(mapArray[i][j] == -1) {
                    this.addBuffUI(res.buffD, i, j, rule)
                }
                if(mapArray[i][j] == -2) {
                    this.addBuffUI(res.buffS, i, j, rule)
                }
                if(mapArray[i][j] == -3) {
                    this.addBuffUI(res.buffR, i, j, rule)
                }
                if(mapArray[i][j] == 1) {
                    this.addObjectUI(res.treeUI, i, j,0, rule)
                }
                if(mapArray[i][j] == 2) {
                    this.addObjectUI(res.hole, i, j,0, rule)
                }
            }
        }
    },


    addBuffUI:function (res, corX ,corY, rule) {
        var object = new cc.Sprite(res)
        object.setScale(CELLWIDTH/object.getContentSize().height)
        var pos
        if(rule == 1) {
            pos = this._gameStateManager.playerA.convertCordinateToPos(corX, corY)
        }
        else{
            pos = this._gameStateManager.playerA.convertCordinateToPos2(corX, corY)
        }
        object.setPosition(pos)
        this.addChild(object,999,res+rule)
    },

    addObjectUI:function (res, corX ,corY,direc, rule ) {
        var object = new cc.Sprite(res)
        object.setScale(0.88*CELLWIDTH/object.getContentSize().height)
        var pos
        if(rule == 1) {
            pos = this._gameStateManager.playerA.convertCordinateToPos(corX, corY)
        }
        else{
            pos = this._gameStateManager.playerA.convertCordinateToPos2(corX, corY)
        }
        object.setPosition(pos)
        if(direc == 8){
            object.setRotation(90)
        }
        if(direc == 4){
            object.setRotation(180)
        }
        if(direc == 2){
            object.setRotation(270)
        }
        this.addChild(object,1000,res+rule)
    },

    update:function (dt) {
        this.checkTouchRight()
        this.createObjectByTouch2();
        var children = this.children;
        for (i in children) {
            children[i].update(dt);
        }

        if(this._gameStateManager.playerA._map.monsters[0].des){
            this.healthA.setString(this._gameStateManager.playerA.health)
            this._gameStateManager.playerA._map.monsters[0].des = false
        }

    },

});

GameUI.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameUI();
    scene.addChild(layer);
    return scene;
};
