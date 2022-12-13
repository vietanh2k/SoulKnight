FIREBALL_WIDTH = 180

const IceBall = Spell.extend({
    ctor: function (playerState, position, mapCast) {
        this._super(playerState, position);
        const config = cf.POTION.potion[SPELL_ID.FIREBALL]
        // this.initOpponentUI(position)
        // this.initFromConfig(playerState, config)
        this.mapCast = mapCast;
        this.radius = 0.8
        this.canCast = true
        return true;
    },

    //
    // initOpponentUI: function (position) {
    //     if (this.renderRule === 1) {
    //         this.speed2 = 10 * MAP_CONFIG.CELL_WIDTH
    //         this.position= new Vec2(position.x, position.y-MAP_CONFIG.CELL_WIDTH*4)
    //     }else{
    //         this.position= new Vec2(position.x, position.y+MAP_CONFIG.CELL_WIDTH*4)
    //         this.speed2 = -10 * MAP_CONFIG.CELL_WIDTH
    //     }
    // },

    logicUpdate: function (playerState, dt){
        if(this.canCast == true) {
            this.canCast = false
            this.explose(this._playerState, this.mapCast)
            this.destroy()
        }

    },

    // fall: function (distance){
    //     this.position.y += distance
    //     if(this.renderRule == 1) {
    //         if (this.position.y >= this.castPosition.y) {
    //             this.cast(2)
    //             this.runAction(cc.sequence(cc.delayTime(0.05),cc.callFunc(()=>{
    //                 this.explose(this._playerState, null);
    //             })))
    //         }
    //     }else{
    //         if(this.position.y <= this.castPosition.y){
    //             this.cast(2)
    //             this.runAction(cc.sequence(cc.delayTime(0.05),cc.callFunc(()=>{
    //                 this.explose(this._playerState, null);
    //             })))
    //
    //         }
    //     }
    //
    //
    //
    //     //this.debug(map)
    // },

    explose: function (playerState, mapCast) {
        const map = playerState.getMap();
        let objects;
            if(mapCast == 1) {
                objects = map.queryEnemiesCircle(this.castPosition, MAP_CONFIG.CELL_WIDTH * this.radius)
            }else {
                return;
                objects = map.queryEnemiesCircle(this.castPosition, MAP_CONFIG.CELL_WIDTH * this.radius);
            }

            // const monsters = map.queryEnemiesCircle(this.castPosition,MAP_CONFIG.CELL_WIDTH*this.radius)
        for (let i = 0; i < objects.length; i++) {
            objects[i].___freezeEffect = new FreezeEffect(ICEMAN_FREEZE_EFFECT_TIME, objects[i])
            playerState.getMap().addEffect(objects[i].___freezeEffect)
            // monsters[i].hurtUI()
        }
        // let objectList = map.getObjectInRange(this.castPosition, 1.5);
        // for (let object of objectList) {
        //     if (this.canAttack(object)) {
        //         object.takeDamage(5);
        //         object.hurtUI();
        //     }
        // }
        // for (let monster of monsters) {
        //     cc.log('66666666666666666666666666')
        //     monster.takeDamage(50)
        //     monster.hurtUI()
        // }
    }
});