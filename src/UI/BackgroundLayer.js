BackgroundLayerInstance = null

var BackgroundLayer = cc.Layer.extend({
    mapView: null,
    player: null,
    objectView: null,
    isTouchFire: false,
    xx: 0,
    yy: 0,

    ctor: function() {
        this._super();
        var pos = this.convertIndexToPosLogic(7, 7)
        this.objectView = new ObjectView();
        this.mapView = new MapView();
        // this.mapView.findPathBFS(9,9, 3)
        this.player = new Character(pos, this.mapView);
        this.objectView.addChar(this.player);
        this.objectView.updateMap(this.mapView);
        this.xx = cc.winSize.width/2;
        this.yy = cc.winSize.height/2;
        this.isTouchFire = false;
        // this.p = new  Bullet(cc.p(200,200), this.mapView, cc.p(1,1))
        // this.objectView.addBullet(this.p);

        winSize = cc.director.getWinSize();
        this.initMap()
        this.addChild(this.player);
        // this.addChild(this.p)
        BackgroundLayerInstance = this

        var pos2 = this.convertIndexToPosLogic(7, 9)
        let enemy = new Enemy(pos2, this.mapView);
        this.objectView.addEnemy(enemy);

        var pos3 = this.convertIndexToPosLogic(12, 9)
        let enemy2 = new Enemy(pos3, this.mapView);
        this.objectView.addEnemy(enemy2);
        let p1 = new cc.p(450.62, 685.11)
        let p2 = new cc.p(449.91, 702.56)
        let tam = new cc.p(450, 700.17)
        getColisionDoanThangVaHCN(p1,p2,tam, 50, 300)

        //
        // var mainscene = ccs.load(res.paddleHp, "res/").node;
        //
        // this.addChild(mainscene,0,'scene');


    },

    initMap: function() {

        for(var i=0; i <= 20; i++){
            for(var j=0; j<= 15; j++){
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
        this.addChild(object)
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
        if(this.player.posLogic.x >=GAME_CONFIG.CELLSIZE*MAP_WIDTH/4 && this.player.posLogic.x <= GAME_CONFIG.CELLSIZE*MAP_WIDTH/4*3) {
            this.x = -(this.player.x - this.xx);
        }
        if(this.player.posLogic.y >=GAME_CONFIG.CELLSIZE*MAP_HEIGHT/4 && this.player.posLogic.y <= GAME_CONFIG.CELLSIZE*MAP_HEIGHT/4*3) {
            this.y = -(this.player.y - this.yy);
        }
    },

    fireBullet: function() {
        var bullet = this.player.createBullet()
        this.objectView.addBullet(bullet)

    },

    setTouchFireState: function(state) {
        this.isTouchFire = state;

    },

});
