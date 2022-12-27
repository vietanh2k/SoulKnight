const FireBall = Spell.extend({
    ctor: function (playerState, position, stat) {
        this._super(playerState, position);
        this.radius = stat[0]
        this.dame = Math.floor(stat[1]*this.hpMul);
        cc.log("dame = "+this.dame)
        this.canCast = true
        return true;
    },


    logicUpdate: function (playerState, dt){
        if(this.canCast == true) {
            this.canCast = false
            this.explose(this._playerState, null)
            this.destroy()
        }

    },


    /*
    Nổ dame cho tất cả monster trong phạm vị bán kính nổ
     */
    explose: function (playerState, pos) {
        const map = playerState.getMap();
        const monsters = map.queryEnemiesCircle(this.castPosition,MAP_CONFIG.CELL_WIDTH*this.radius)
        cc.log('dem = '+monsters.length)
        for (let i = 0; i < monsters.length; i++) {
            monsters[i].takeDamage(playerState, this.dame);
            /*
            đẩy quái, càng gần tâm đẩy càng xa
             */
            let vecPush = monsters[i].position.sub(this.castPosition)
            let timePush = 1/2*(MAP_CONFIG.CELL_WIDTH*this.radius-vecPush.length())/(MAP_CONFIG.CELL_WIDTH*this.radius)
            if(vecPush.isZero()){
                vecPush.set(Random.range(0.5, 1), Random.range(0.5, 1));
            }
            let vecPushNormal = (vecPush.normalize()).mul((MAP_CONFIG.CELL_WIDTH*this.radius-vecPush.length())/(MAP_CONFIG.CELL_WIDTH*this.radius))

            if (monsters[i].___pushEffect) {
                monsters[i].___pushEffect.reset()
            } else {
                monsters[i].___pushEffect = new PushEffect( vecPushNormal, timePush, monsters[i], playerState.getMap())
                playerState.getMap().addEffect(monsters[i].___pushEffect)
            }
            monsters[i].hurtUI()
        }
    }
});