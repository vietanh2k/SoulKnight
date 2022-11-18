const Cell = cc.Class.extend({
    ctor: function () {
        this.state = 0
        this.location = new Vec2(0,0)
        this.position = new Vec2(0,0)
        this.nextCell = null
        this.prevCell = null
        this.nextPos = null
    },

    setState: function(state) {
        this.state = state
    },

    getLocation: function() {
        return this.location
    },

    getPosition: function() {
        return this.position
    },

    getCenterPosition: function() {
        return this.position
    },

    getNextCell: function() {
        return this.nextCell
    },

    getPrevCell: function() {
        return this.prevCell
    },

    setLocation: function (x, y) {
        this.location.set(x, y)
        this.position.set(x * MAP_CONFIG.CELL_WIDTH + MAP_CONFIG.CELL_WIDTH / 2, y * MAP_CONFIG.CELL_HEIGHT + MAP_CONFIG.CELL_HEIGHT / 2)
    },

    updateEdgePositionWithNextCell: function() {
        let nextCellPos = this.nextCell.getCenterPosition()
        let currentCellPos = this.getCenterPosition()
        let d = nextCellPos.sub(currentCellPos).normalize()
        d.set(Math.round(d.x), Math.round((d.y)))

        this.nextPos = currentCellPos.add(d.mul(MAP_CONFIG.HALF_CELL_DIMENSIONS_OFFSET[Math.round(d.y) + 1][Math.round(d.x) + 1]))

        cc.log('d: ' + d + '\tnextCellPos: ' + nextCellPos + '\tcurrentCellPos: ' + currentCellPos + '\tnextPos: ' + this.nextPos)
    },

    getEdgePositionWithNextCell: function () {
        return this.nextPos;
    }
})