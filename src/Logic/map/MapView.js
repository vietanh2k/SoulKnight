
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

    renderMonster: function () {
        for (i in this.monsters){
            this.monsters[i].render(this._playerState)
        }
    },

    update:function (dt){
        this.updateMonster(dt)
        this.renderMonster()
    },

    addMonster:function (){
        var monster = new Monster(1, this._playerState)
        this.monsters.push(monster)
        return monster
    },

    getCellAtPosition: function (position) {
        const y = Math.floor(position.y / MAP_CONFIG.CELL_HEIGHT);
        const x = Math.floor(position.x / MAP_CONFIG.CELL_WIDTH);

        if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
            return this.cells[x][y];
        }

        return null;
    }


});
