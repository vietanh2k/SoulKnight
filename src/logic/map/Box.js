var Box = cc.Class.extend({
    ctor:function (dx, dy) {
        this.curHp = 5;
        this.dx = dx;
        this.dy = dy;

    },

    init:function () {

    },

    takeDame:function (many) {
        this.curHp = Math.max(0, this.curHp-many);
        if(this.curHp <= 0){
            this.destroy();
        }
    },

    destroy:function () {
        BackgroundLayerInstance.mapView.mapArray[this.dx][this.dy] = 0;
        BackgroundLayerInstance.objectView.delBoxInMap(this.dx, this.dy);
        BackgroundLayerInstance.delBoxUi(this.dx, this.dy)
        BackgroundLayerInstance.mapView.delBox(this.dx, this.dy);
    },


});
