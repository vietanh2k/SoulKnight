
const IceBall = Spell.extend({
    ctor: function (playerState, position, mapCast, stat) {
        this._super(playerState, position);
        this.mapCast = mapCast;
        this.radius = stat[0];
        this.dame = Math.floor(stat[1]*this.hpMul);
        cc.log("dame = "+this.dame)
        this.canCast = true;
        return true;
    },


    logicUpdate: function (playerState, dt){
        if(this.canCast == true) {
            this.canCast = false
            this.explose(this._playerState, this.mapCast)
            this.destroy()
        }

    },

    /*
    mapCast = 1 => cast o map player => freeze monster
    mapCast = 2 => cast o map enemy => freeze tower
     */
    explose: function (playerState, mapCast) {
        const map = playerState.getMap();
        let objects;
        if(mapCast == 1) {
            objects = map.queryEnemiesCircle(this.castPosition, MAP_CONFIG.CELL_WIDTH * this.radius)
            cc.log('dem = '+objects.length)
            for (let i = 0; i < objects.length; i++) {
                const monster = objects[i]
                monster.takeDamage(playerState, this.dame, this)
                monster.hurtUI()
                if (monster instanceof Ninja) {
                    if (!monster.concept) {
                        continue;
                    }
                }

                if (monster.___freezeEffect) {
                    monster.___freezeEffect.reset()
                } else {
                    monster.___freezeEffect = new FreezeEffect(SPELL_CONFIG.ICEBALL_FREEZE_MONSTER_TIME, monster)
                    playerState.getMap().addEffect(monster.___freezeEffect)
                }
                // monsters[i].hurtUI()
            }
        }else {
            objects = map.queryTowerCircleWithoutOverlap(this.castPosition, MAP_CONFIG.CELL_WIDTH * this.radius);
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].___freezeEffect) {
                    objects[i].___freezeEffect.reset()
                } else {
                    objects[i].___freezeEffect = new FreezeEffect(SPELL_CONFIG.ICEBALL_FREEZE_TOWER_TIME, objects[i])
                    playerState.getMap().addEffect(objects[i].___freezeEffect)
                }

                // monsters[i].hurtUI()
            }
        }

            // const monsters = map.queryEnemiesCircle(this.castPosition,MAP_CONFIG.CELL_WIDTH*this.radius)

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