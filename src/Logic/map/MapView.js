
var MapView = cc.Class.extend({
    trees: null,
    monsters: null,
    spells: null,
    bullets: null,
    towers: null,
    _mapController: null,
    _playerState: null,


    ctor: function (playerState, intArray) {
        this._playerState = playerState

        this._mapController = new MapController(intArray)
        this.monsters = []
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
                column.push(new Vec2(0, 0))
            }
            this.parents.push(column)
        }

        this.updatePathForCells()

    },
    preloadConfig: function () {
        if (_TOWER_CONFIG == undefined || _TOWER_CONFIG == null) {
            _TOWER_CONFIG = cc.loader.getRes("config/Tower.json");
        }
    },
    init: function () {

        winSize = cc.director.getWinSize();

        // var monster = new Monster(1, this._playerState)
        // this.monsters.push(monster)




        return true;
    },
    updateMonster: function () {
        var leng = this.monsters.length
        for (i in this.monsters) {

            if (this.monsters[leng - i - 1].isDestroy) {
                this.monsters.splice(leng - i - 1, 1)
            }
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    updateTower: function (dt) {
        try {
            var temp = []
            this.towers.map(tower => {
                tower.logicUpdate(this._playerState, dt)
                if (!tower.isDestroy) {
                    temp.push(tower)
                }
            })
            this.towers = temp
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },
    updateBullet: function (dt) {
        try {
            var temp = []
            this.bullets.map(bullet => {
                bullet.logicUpdate(this._playerState, dt)
                if (!bullet.isDestroy) {
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
        for (i in this.monsters) {
            this.monsters[i].render(this._playerState)
        }
    },
    renderTower: function () {
        for (i in this.towers) {
            this.towers[i].render(this._playerState)
        }
    },
    renderBullet: function () {
        for (i in this.bullets) {
            this.bullets[i].render(this._playerState)
        }
    },

    update: function (dt) {
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

    addMonster: function () {
        var monster = new Monster(1, this._playerState)
        this.monsters.push(monster)
        return monster
    },
    deployTower: function (card, position) {
        cc.log("Deploy tower with " + JSON.stringify(card) + " at location: " + JSON.stringify(position))
        cc.log("TW size:" + this.towers.length)
        var tower = new Tower("1", this._playerState, position, this);
        this.towers.push(tower)
        GameUI.instance.addChild(tower);
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
    getObjectInRange: function (objectA, range) {
        var objInRange = []
        var EuclidLength = function (vec) {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y)
        }
        // cc.log('vec: '+ objectA+ ' range actual'+ range*(CELLWIDTH+CELLWIDTH)/2.0)
        this.bullets.forEach(obj => {
            if (range * (CELLWIDTH + CELLWIDTH) / 2.0 >= EuclidLength(objectA.sub(obj.position))) {
                objInRange.push(obj)
            }
        })
        this.towers.forEach(obj => {
            if (range * (CELLWIDTH + CELLWIDTH) / 2.0 >= EuclidLength(objectA.sub(obj.position))) {
                objInRange.push(obj)
            }
        })
        this.monsters.forEach(obj => {
            // cc.log('Bvec: '+ obj.position+ ' dis = '+ EuclidLength(objectA.sub(obj.position)))
            if (range * (CELLWIDTH + CELLWIDTH) / 2.0 >= EuclidLength(objectA.sub(obj.position))) {
                objInRange.push(obj)
            }
        })
        return objInRange

    },
    /**
     * Thêm 1 bullet vào map
     * @param {Bullet} bullet*/
    addNewBullet: function (bullet) {
        if (this.bullets == undefined) {
            this.bullets = [bullet]
        } else {
            this.bullets.push(bullet)
        }
        GameUI.instance.addChild(bullet);
    }


});
