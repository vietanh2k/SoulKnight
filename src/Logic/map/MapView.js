/**
 * Đối tượng Map trong thiết kế
 * */
var MapView = cc.Class.extend({
    trees: null,
    monsters: null,
    spells: null,
    bullets:null,
    towers:null,
    _mapController:null,
    _playerState: null,
    rule:null,


    ctor:function (playerState, intArray, rule) {
        this._playerState = playerState
        this.rule = rule
        this._mapController = new MapController(intArray,this.rule)
        this.monsters = []
        this.towers = []
        this.bullets = []
        this.init();

        this.cells = []
        for (let x = 0; x < MAP_CONFIG.MAP_WIDTH; x++) {
            let column = []
            for (let y = 0; y < MAP_CONFIG.MAP_HEIGHT; y++) {
                const cell = new Cell()
                cell.setLocation(x, y)
                column.push(cell)
            }
            this.cells.push(column)
        }

        this.preloadConfig()

        this.gateCell = new Cell();
        this.gateCell.setLocation(1, -1)

        this.mainTowerCell = new Cell();
        this.mainTowerCell.setLocation(MAP_CONFIG.MAP_WIDTH, MAP_CONFIG.MAP_HEIGHT - 1);

        this.parents = []
        for (let x = 0; x < MAP_CONFIG.MAP_WIDTH; x++) {
            let column = []
            for (let y = 0; y < MAP_CONFIG.MAP_HEIGHT; y++) {
                column.push(new Vec2(0,0))
            }
            this.parents.push(column)
        }

        this.updatePathForCells()

    },
    preloadConfig: function (){
        if (_TOWER_CONFIG == undefined || _TOWER_CONFIG == null) {
            _TOWER_CONFIG = cc.loader.getRes("config/Tower.json");
        }
    },
    init:function () {

        winSize = cc.director.getWinSize();

        // var monster = new Monster(1, this._playerState)
        // this.monsters.push(monster)




        return true;
    },

    updatePathForCells: function() {
        const pathFinder = this._mapController
        pathFinder.findPathBFS()

        const paddedParents = pathFinder.getParents()
        for (let x = 0; x < MAP_CONFIG.MAP_WIDTH; x++) {
            for (let y = 0; y < MAP_CONFIG.MAP_HEIGHT; y++) {
                const paddedParent = paddedParents[x][y + 1]

                if (paddedParent) {
                    this.parents[x][y].set(paddedParent.x, paddedParent.y - 1)
                } else {
                    this.parents[x][y].set(-1000, -1000)
                }
            }
        }

        const parents = this.parents
        for (let x = 0; x < MAP_WIDTH; x++) {
            for (let y = 0; y < MAP_HEIGHT; y++) {
                const parent = parents[x][y];
                const cell = this.cells[x][y]

                if (parent.x === -1000) {
                    cell.nextCell = null
                    cell.prevCell = null
                    cell.state = 1
                    continue;
                }

                cell.state = 0

                if (parent.y >= MAP_HEIGHT || parent.x >= MAP_WIDTH) {
                    cc.log("Hahahahahahaha")
                    continue;
                }

                cell.nextCell = this.cells[parent.x][parent.y];
                this.cells[parent.x][parent.y].prevCell = cell;

                if (!cell.nextCell) {
                    cc.log( "parent: " + parent + "\tcell.nextCell: " + this.cells[parent.x][parent.y])
                }

            }
        }

        this.cells[0][0].prevCell = this.gateCell;
        this.cells[MAP_CONFIG.MAP_WIDTH - 1][MAP_CONFIG.MAP_HEIGHT - 1].nextCell = this.mainTowerCell;

        if (this.cells[0][0].state === 1) {
            cc.log("===========================================ERROR================================================")
        }

        for (let x = 0; x < MAP_WIDTH; x++) {
            for (let y = 0; y < MAP_HEIGHT; y++) {
                const currentCell = this.cells[x][y];

                if (currentCell.getNextCell() == null || currentCell.getPrevCell() == null) {
                    continue
                }

                currentCell.isCornerCell =
                    currentCell.getPrevCell().getLocation()
                        .sub(currentCell.getLocation())
                        .dot(
                            currentCell.getNextCell().getLocation()
                                .sub(currentCell.getLocation())
                        ) === 0
                currentCell.updateEdgePositionWithNextCell()
            }
        }
    },

    updateMonster:function (dt) {
        try {
            var leng = this.monsters.length
            for (i in this.monsters){
                this.monsters[i].logicUpdate(this._playerState, dt)
                if(this.monsters[leng-i-1].isDestroy){
                    this.monsters.splice(leng-i-1, 1)
                }
            }
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    updateTower:function (dt) {
        try {
            var temp = []
            this.towers.map(tower=>{
                tower.logicUpdate(this._playerState, dt)
                if(!tower.isDestroy){
                    temp.push(tower)
                }
            })
            this.towers = temp
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },
    updateBullet:function (dt) {
        try {
            var temp = []
            this.bullets.map(bullet=>{
                bullet.logicUpdate(this._playerState, dt)
                if(!bullet.isDestroy){
                    temp.push(bullet)
                }
            })
            this.bullets = temp
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    renderMonster: function () {
        for (i in this.monsters){
            this.monsters[i].render(this._playerState)
        }
    },
    renderTower: function () {
        for (i in this.towers){
            this.towers[i].render(this._playerState)
        }
    },
    renderBullet: function () {
        for (i in this.bullets){
            this.bullets[i].render(this._playerState)
        }
    },

    update:function (dt){
        this.updateBullet(dt)
        this.updateTower(dt)
        this.updateMonster(dt)

        // cc.log('____________update___________________')
        // this.towers.forEach(tw=>{
        //     cc.log(tw.position)
        // })
        // this.monsters.forEach(tw=>{
        //     cc.log(tw.position)
        // })
        // this.bullets.forEach(tw=>{
        //     cc.log(tw.position)
        // })

        this.renderTower()
        this.renderMonster()
        this.renderBullet(0)
    },

    addMonster:function (){
        var monster = new Monster(1, this._playerState)
        this.monsters.push(monster)
        return monster
    },
    deployTower: function (card, position){
        cc.log("Deploy tower with " + JSON.stringify(card) + " at location: " + JSON.stringify(position))
        cc.log("TW size:" + this.towers.length)
        var tower, is_update= false;
        var cell = this.getCellAtPosition(position);
        if(!cell.getObjectOn()){
            is_update = false;
        } else {
            is_update = true;
        }
        if(is_update){
            cell.getObjectOn().upgrade(card);
            return;
        }
        switch (card){
            case 17:
                tower = new TWizard(card, this._playerState, position, this);

                break;
            default:
                tower = new TCanon(card, this._playerState, position, this);
        }

        this.towers.push(tower)
        GameUI.instance.addChild(tower);
        cell.setObjectOn(tower)
        // if(cell.objectOn==undefined || cell.objectOn==null ){
        //     cell.objectOn = tower;
        // }
        cc.log("Deploy success")

        return tower
    },

    getCellAtPosition: function (position) {
        const y = Math.floor(position.y / MAP_CONFIG.CELL_HEIGHT);
        const x = Math.floor(position.x / MAP_CONFIG.CELL_WIDTH);

        if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
            return this.cells[x][y];
        }

        return null;
    },
    /**Lấy danh sách đối tượng trong 1 range
     * todo: update logic
     * @param {Vec2} objectA: vị trí trên map
     * @param {Number} range: độ dài tính theo ô*/
    getObjectInRange: function (objectA, range){
        var objInRange = []
        var EuclidLength = function (vec) {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y)
        }
        // cc.log('vec: '+ objectA+ ' range actual'+ range*(CELLWIDTH+CELLWIDTH)/2.0)
        this.bullets.forEach(obj=>{
            if(range*(CELLWIDTH+CELLWIDTH)/2.0>= EuclidLength(objectA.sub(obj.position))){
                objInRange.push(obj)
            }
        })
        this.towers.forEach(obj=>{
            if(range*(CELLWIDTH+CELLWIDTH)/2.0>= EuclidLength(objectA.sub(obj.position))){
                objInRange.push(obj)
            }
        })
        this.monsters.forEach(obj=>{
            // cc.log('Bvec: '+ obj.position+ ' dis = '+ EuclidLength(objectA.sub(obj.position)))
            if(range*(CELLWIDTH+CELLWIDTH)/2.0>= EuclidLength(objectA.sub(obj.position))){
                objInRange.push(obj)
            }
        })
        return objInRange

    },
    /**
     * Thêm 1 bullet vào map
     * @param {Bullet} bullet*/
    addNewBullet: function (bullet){
        if(this.bullets==undefined){
            this.bullets = [bullet]
        } else {
            this.bullets.push(bullet)
        }
        GameUI.instance.addChild(bullet);
    }


});
