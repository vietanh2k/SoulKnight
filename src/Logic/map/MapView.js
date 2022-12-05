/**
 * Đối tượng Map trong thiết kế
 * */

const OFFSET_CIRCLE_TO_RECT_X = [1,1,-1,-1]
const OFFSET_CIRCLE_TO_RECT_Y = [1,-1,1,-1]

const SERVER_CELL_WIDTH_CONFIG = SERVER_CELL_WIDTH_CONFIG || 50;
var MapView = cc.Class.extend({
    ctor:function (playerState, intArray, rule) {
        this._playerState = playerState
        this.rule = rule
        this._mapController = new MapController(intArray,this.rule)
        this.monsters = new UnorderedList() //[]
        this.towers =  new UnorderedList() //[]
        this.bullets =  new UnorderedList() //[]
        this.spells =  new UnorderedList() //[]
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

        this.nextGateCell = new Cell()
        this.nextGateCell.setLocation(0, -1)

        this.gateCell.nextCell = this.nextGateCell
        this.nextGateCell.nextCell = this.cells[0][0]
        this.gateCell.updateEdgePositionWithNextCell()
        this.nextGateCell.updateEdgePositionWithNextCell()

        this.mainTowerCell = new Cell();
        this.mainTowerCell.setLocation(MAP_CONFIG.MAP_WIDTH, MAP_CONFIG.MAP_HEIGHT - 1);
        this.cells[MAP_CONFIG.MAP_WIDTH - 1][MAP_CONFIG.MAP_HEIGHT - 1].nextCell = this.mainTowerCell;

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

    // per frame call
    constructWorld: function () {
        const self = this

        for (let x = 0; x < MAP_CONFIG.MAP_WIDTH; x++) {
            for (let y = 0; y < MAP_CONFIG.MAP_HEIGHT; y++) {
                const cell = this.cells[x][y]
                cell.clearMonsterOnCell()
            }
        }

        const cells = [undefined,undefined,undefined,undefined]

        const tempPos = new Vec2(0,0)

        this.monsters.forEach((monster, id, list) => {
            cells.length = 0

            const pos = monster.position
            const r = monster.hitRadius

            for (let i = 0; i < 4; i++) {
                tempPos.x = pos.x + OFFSET_CIRCLE_TO_RECT_X[i] * r
                tempPos.y = pos.y + OFFSET_CIRCLE_TO_RECT_Y[i] * r

                const cell = self.getCellAtPosition(tempPos)

                if (cell && cells.indexOf(cell) === -1) {
                    cells.push(cell)
                    cell.addMonsterToCell(monster)
                }
            }
        })
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
                    //cell.prevCell = null
                    cell.state = 1
                    continue;
                }

                cell.state = 0

                if (parent.y >= MAP_HEIGHT || parent.x >= MAP_WIDTH) {
                    cc.log("Hahahahahahaha")
                    continue;
                }

                cell.nextCell = this.cells[parent.x][parent.y];
                //this.cells[parent.x][parent.y].prevCell = cell;

                if (!cell.nextCell) {
                    cc.log( "parent: " + parent + "\tcell.nextCell: " + this.cells[parent.x][parent.y])
                }

            }
        }

        //this.cells[0][0].prevCell = this.gateCell;
        //this.cells[MAP_CONFIG.MAP_WIDTH - 1][MAP_CONFIG.MAP_HEIGHT - 1].nextCell = this.mainTowerCell;

        if (this.cells[0][0].state === 1) {
            cc.log("===========================================ERROR================================================")
        }

        for (let x = 0; x < MAP_WIDTH; x++) {
            for (let y = 0; y < MAP_HEIGHT; y++) {
                const currentCell = this.cells[x][y];

                currentCell.nextPos = null;
                currentCell.outPos = null;

                if (currentCell.getNextCell() == null) {
                    continue
                }

                currentCell.updateEdgePositionWithNextCell()
            }
        }
    },

    updateMonster:function (dt) {
        try {
            /*const len = this.monsters.length
            for (let i = len - 1; i !== -1; i--) {
                const monster = this.monsters[i]
                monster.logicUpdate(this._playerState, dt)
                if(monster.isDestroy){
                    this.monsters.splice(i, 1)
                }
            }*/

            const self = this

            this.monsters.forEach((monster, id, list) => {
                if (!monster.active) return

                const monsters = self.queryEnemiesCircle(monster.position, monster.hitRadius)
                for (let i = 0; i < monsters.length; i++) {
                    const m = monsters[i]

                    if (m !== monster) {
                        monster.onImpact(this._playerState, m)
                    }
                }
            })

            this.monsters.forEach((monster, id, list) => {
                if (!monster.active) return

                monster.logicUpdate(this._playerState, dt)

                if(monster.isDestroy){
                    list.remove(id)
                }
            })

        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    updateTower:function (dt) {
        try {
            /*var temp = []
            this.towers.map(tower=>{
                tower.logicUpdate(this._playerState, dt)
                if(!tower.isDestroy){
                    temp.push(tower)
                }
            })
            this.towers = temp*/

            this.towers.forEach((tower, id, list) => {
                tower.logicUpdate(this._playerState, dt)

                if(tower.isDestroy){
                    list.remove(id)
                }
            })
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },
    updateBullet:function (dt) {
        try {
            /*var temp = []
            this.bullets.map(bullet=>{
                bullet.logicUpdate(this._playerState, dt)
                if(!bullet.isDestroy){
                    temp.push(bullet)
                }
            })
            this.bullets = temp*/

            this.bullets.forEach((bullet, id, list) => {
                bullet.logicUpdate(this._playerState, dt)

                if(bullet.isDestroy){
                    list.remove(id)
                }
            })
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    updateSpell:function (dt) {
        try {
            this.spells.forEach((spell, id, list) => {
                spell.logicUpdate(this._playerState, dt);

                if(spell.isDestroy){
                    list.remove(id)
                }
            })
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    renderMonster: function (rule) {
        /*for (i in this.monsters){
            if(this.rule == 1) {
                this.monsters[i].setLocalZOrder(this.monsters[i].position.y)
            }else{
                this.monsters[i].setLocalZOrder(winSize.height- this.monsters[i].position.y)
            }
            this.monsters[i].render(this._playerState)
        }*/

        const self = this

        this.monsters.forEach((monster, id, list) => {
            if (self.rule === 1) {
                monster.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + monster.position.y)
            }else{
                monster.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + winSize.height - monster.position.y)
            }
            monster.render(self._playerState)
        })
    },
    renderTower: function () {
        /*for (i in this.towers){
            this.towers[i].render(this._playerState)
        }*/

        const self = this

        this.towers.forEach((tower, id, list) => {
            if (self.rule === 1) {
                tower.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + tower.position.y)
            }else{
                tower.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + winSize.height - tower.position.y)
            }
            tower.render(this._playerState)
        })
    },
    renderBullet: function () {
        /*for (i in this.bullets){
            this.bullets[i].render(this._playerState)
        }*/

        this.bullets.forEach((bullet, id, list) => {
            bullet.render(this._playerState)
        })
    },
    renderSpell: function () {

        const self = this

        this.spells.forEach((spell, id, list) => {
            spell.render(this._playerState)
        })
    },
    update:function (dt) {
        this.constructWorld()

        this.updateBullet(dt)
        this.updateTower(dt)
        this.updateMonster(dt)
        this.updateSpell(dt)

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
        this.renderSpell()
    },

    /*addMonster:function (){
        var monster = new Monster(1, this._playerState)
        this.monsters.push(monster)
        return monster
    },*/

    addMonster: function (monster) {
        monster.mapId = this.monsters.add(monster)
    },

    deployOrUpgradeTower: function (cardType, position) {
        cc.log("Deploy or upgrade tower with card type " + JSON.stringify(cardType) + " at position " + JSON.stringify(position));
        let cell = this.getCellAtPosition(position);

        if (cell.getObjectOn()) {
            if (cf.CARD_TYPE[cardType] === undefined) {
                Utils.addToastToRunningScene('Cannot find card type ' + cardType);
                return;
            } else if (cf.CARD_TYPE[cardType].instance !== cell.getObjectOn().instance) {
                if (this.rule === 1) {
                    Utils.addToastToRunningScene('Không thể xây đè lên trụ cũ!');
                }
                return;
            } else {
                cell.getObjectOn().upgrade(cardType);
                return;
            }
        }

        let tower;
        switch (cardType) {
            case 17:
                tower = new TWizard(cardType, this._playerState, position, this);
                break;
            default:
                tower = new TCannon(cardType, this._playerState, position, this);
                break;
        }
        tower.mapId = this.towers.add(tower);
        GameUI.instance.addChild(tower);
        cell.setObjectOn(tower);
        cc.log("Deploy success");
        return tower;
    },

    deploySpell: function (cardType, position){
        var spell;
        switch (cardType){
            case 0:
                spell = new FireBall(this._playerState, position);
                break;
            case 2:
                spell = new Heal(this._playerState, position);
                break;
            default:
                spell = new FireBall(this._playerState, position);
        }
        spell.mapId = this.spells.add(spell);
        GameUI.instance.addChild(spell);

        return spell;
    },

    getCellAtPosition: function (position) {
        const y = Math.floor(position.y / MAP_CONFIG.CELL_HEIGHT);
        const x = Math.floor(position.x / MAP_CONFIG.CELL_WIDTH);

        if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
            return this.cells[x][y];
        }

        if (y === -1) {
            if (x === 1) return this.gateCell
            if (x === 0) return this.nextGateCell
        }

        //if (y === -1) {
        //    return this.mainTowerCell
        //}

        return null;
    },

    getCell: function (x, y) {
        if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
            return this.cells[x][y];
        }

        if (y === -1) {
            if (x === 1) return this.gateCell
            if (x === 0) return this.nextGateCell
        }

        //if (y === -1) {
        //    return this.mainTowerCell
        //}

        return null;
    },

    /**Lấy danh sách đối tượng trong 1 range
     * todo: update logic
     * @param {Vec2} objectA: vị trí trên map
     * @param {Number} range: độ dài tính theo ô*/
    getObjectInRange: function (objectA, range){
        let objInRange = [];
        const range_in_number = range*SERVER_CELL_WIDTH_CONFIG;
        this.bullets.forEach(obj=>{
            if(range_in_number>= objectA.sub(obj.position).length()){
                objInRange.push(obj)
            }
        })
        this.towers.forEach(obj=>{
            if(range_in_number>= objectA.sub(obj.position).length()){
                objInRange.push(obj)
            }
        })
        this.monsters.forEach(obj=>{
            if(range_in_number>= objectA.sub(obj.position).length()){
                objInRange.push(obj)
            }
        })
        return objInRange

    },
    /**
     * Thêm 1 bullet vào map
     * @param {Bullet} bullet*/
    addNewBullet: function (bullet){
        //if(this.bullets==undefined){
        //    //this.bullets = [bullet]
        //} else {
        //    //this.bullets.push(bullet)
        //}

        bullet.mapId = this.bullets.add(bullet)

        GameUI.instance.addChild(bullet, 1000000000);
    },

    getStartCell: function () {
        return this.gateCell
    },

    // return all monsters that hitBox overlap the circle
    queryEnemiesCircle: function (pos, radius) {
        const self = this
        const monsters = []

        const x1 = Math.floor((pos.x - radius) / MAP_CONFIG.CELL_WIDTH)
        const x2 = Math.ceil((pos.x + radius) / MAP_CONFIG.CELL_WIDTH)

        const y1 = Math.floor((pos.y - radius) / MAP_CONFIG.CELL_HEIGHT)
        const y2 = Math.ceil((pos.y + radius) / MAP_CONFIG.CELL_HEIGHT)

        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                const cell = self.getCell(x, y)

                if (!cell) {
                    continue
                }

                cell.monsters.forEach((monster, id, list) => {
                    monster.isChosen = false
                    monsters.push(monster)
                })
            }
        }

        const ret = []
        monsters.forEach((monster, id, list) => {
            if (monster.isChosen === false
                && Circle.isCirclesOverlapped(monster.position, monster.hitRadius, pos, radius)) {
                ret.push(monster)
                monster.isChosen = true
            }
        })

        return ret
    },

    // return all trees, stones that it's cell on overlap the circle
    queryTreesStonesCircle: function (pos, radius) {
        const self = this
        const treeStones = []

        const x1 = Math.floor((pos.x - radius) / MAP_CONFIG.CELL_WIDTH)
        const x2 = Math.ceil((pos.x + radius) / MAP_CONFIG.CELL_WIDTH)

        const y1 = Math.floor((pos.y - radius) / MAP_CONFIG.CELL_HEIGHT)
        const y2 = Math.ceil((pos.y + radius) / MAP_CONFIG.CELL_HEIGHT)

        for (let x = x1; x < x1; x++) {
            for (let y = y1; y < y2; y++) {
                const cell = self.getCell(x, y)

                if (!cell) {
                    continue
                }

                const treeStone = cell.getObjectOn()
                treeStone.isChosen = false
                treeStone.push(treeStone)
            }
        }

        return treeStones
    },

});
