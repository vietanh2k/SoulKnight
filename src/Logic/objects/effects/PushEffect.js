/*
efect đẩy quái
 */
const PushEffect = Effect.extend({
    ctor: function (vecPush , timePush, monster) {
        this.monster = monster;
        let time = timePush* 3.5/Math.sqrt(Math.sqrt(this.monster.weight));
        this._super(time)
        /*
        khi effect thi monster active = false
         */
        if(!this.monster.isDestroy) {
            this.monster.inactiveSourceCounter++;
            this.monster.play(-1);
            this.monster.active = false;
        }

        this.vecPush = vecPush;
        this.posHole = new Vec2(0,0);
        /*
        tốc độ bay
         */
        this.pushSpeed = MAP_CONFIG.CELL_WIDTH*2.5;
        this.monster.retain()
    },

    update: function (playerState, dt) {
        if(this.countDownTime <= dt && this.monster.concept === "hole"){
            this.monster.takeDamage(playerState,999999, null);
        }

        if(this.monster.concept === "hole"){
            let vecHole = this.posHole.sub(this.monster.position)
            // let vecHole = new Vec2(100,200);
            let tmp = this.monster.position.add(vecHole.mul(dt*2));
            this.monster.position.set(tmp.x, tmp.y);
            return;
        }
        let map = playerState.getMap();
        let tmp = this.monster.position.add(this.vecPush.mul(this.pushSpeed*dt));
        let tmpCell = map.getCellAtPosition(tmp)
        /*
        chạm hố thì trừ 999999hp
        chạm vật cản thì dừng lại
         */
        if(tmpCell && !tmpCell.getNextCell() && map.getMapController().getCellValueAtLocation(tmpCell.getLocation()) === cf.MAP_CELL.HOLE  && !this.monster.isDestroy){
            /*
            animation xuong hole
             */
            this.monster.concept = "hole";
            let rotateAct = cc.RotateBy(0.3,-360).repeatForever()
            let scaleAct = cc.ScaleBy(1,0.1)
            let tmpLocCell = new Vec2(tmpCell.getLocation().x, tmpCell.getLocation().y+1)
            let tmpPosHole = convertIndexToPosLogic(tmpLocCell);
            cc.log("tmpLocCell   "+tmpLocCell.x+"  "+tmpLocCell.y)
            cc.log("tmpPosHole   "+tmpPosHole.x+"  "+tmpPosHole.y)
            this.posHole.set(tmpPosHole.x, tmpPosHole.y+1);
            // let posHole = convertPosLogicToPosUI(tmpCell.getLocation(), 2);
            // let moveAct = cc.MoveTo(0.3, cc.p(200, 300 + CELLWIDTH * 0.5))
            this.monster.runAction(rotateAct)
            this.monster.runAction(scaleAct)
            this.monster.healthUI.visible = false
            if(this.monster.circle != null) {
                this.monster.circle.visible = false
            }

            if(this.monster.shadowSprite != null  && !this.monster.isDestroy) {
                this.monster.shadowSprite.visible = false
            }
            // this.monster.runAction(cc.MoveTo(0.3, cc.p(200, 300 + CELLWIDTH * 0.5)))
            // this.monster.takeDamage(playerState,999999, null);
            this.countDownTime= 1;
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
            if ((--this.monster.inactiveSourceCounter) === 0) {
                this.monster.active = true;
                this.monster.play(0)
            }
        }

        this.monster.___pushEffect = null;
        this.monster.release()
    }
})