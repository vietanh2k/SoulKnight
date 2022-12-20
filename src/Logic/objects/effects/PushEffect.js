/*
efect đẩy quái
 */
const PushEffect = Effect.extend({
    ctor: function (vecPush , timePush, monster) {
        this.monster = monster;
        let time = timePush* 5/Math.sqrt(this.monster.weight);
        this._super(time)

        this.monster.inactiveSourceCounter++
        this.monster.play(-1)
        this.vecPush = vecPush;
        /*
        tốc độ bay
         */
        this.pushSpeed = MAP_CONFIG.CELL_WIDTH*2.5;
        this.monster.retain()
    },

    update: function (playerState, dt) {
        let map = playerState.getMap();
        let tmp = this.monster.position.add(this.vecPush.mul(this.pushSpeed*dt));
        let tmpCell = map.getCellAtPosition(tmp)
        /*
        chạm hố thì trừ 999999hp
        chạm vật cản thì dừng lại
         */
        if(tmpCell && !tmpCell.getNextCell() && map.getMapController().getCellValueAtLocation(tmpCell.getLocation()) === cf.MAP_CELL.HOLE){
            this.monster.takeDamage(playerState,999999, null);
            this.countDownTime= 0;
            return true;
        }
        if(!tmpCell || !tmpCell.getNextCell()){
            this.countDownTime= 0;
            return true;
        }
        this.monster.position.set(tmp.x, tmp.y);
    },

    destroy: function (playerState) {
        if( !this.monster.isDestroy) {
            this.monster.play(0)
        }
        this.monster.___pushEffect = null;
        this.monster.inactiveSourceCounter--;
        this.monster.release()
    }
})