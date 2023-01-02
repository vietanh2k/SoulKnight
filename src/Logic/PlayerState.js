
var PlayerState = cc.Class.extend({
    rule: null,
    uid: null,
    energy: null,
    health: null,
    //_map:null,
    deck: null,
    intArray: null,

    ctor: function (rule, gameState) {
        this.rule = rule
        this.health = GAME_CONFIG.MAX_HP;
        this.energy = GAME_CONFIG.START_ENERGY;
        this.intArray =  Array.from(
            {length:MAP_CONFIG.MAP_WIDTH},
            ()=>Array.from(
                {length:MAP_CONFIG.MAP_HEIGHT}
            )
        );
        this.init();
        this._map = null

        this.timePerMonsterMax = GAME_CONFIG.TIME_PER_MONSTER_IN_WAVE;
        this.timePerMonster = GAME_CONFIG.TIME_PER_MONSTER_IN_WAVE;

        this.monstersToSpawn = []
        this.monstersIdToSpawn = []
        this.monstersHpMulToSpawn = []
        this.isCardMonsters = []

        this.gameStateManager = gameState
        /*
        dem tong vi tri,hp, frame destroy cua monster moi 300 frame
         */
        this.countPos = new Vec2(0,0);
        this.countHP = 0;
        this.countDestroy = 0;


    },
    init: function () {

        winSize = cc.director.getWinSize();




        return true;
    },

    countAllMonster:function () {
        const monsters = this.getMap().getMonsters();
        monsters.forEach((monster, __, ___) => {
            const x = this.countPos.x + monster.position.x;
            const y = this.countPos.y + monster.position.y;
            this.countPos.set(x,y);
            this.countHP += monster.getHealth();
        });
    },

    addCountDestroyFrame:function (frame) {
        this.countDestroy += frame;
    },

    getCountPosition:function () {
        return this.countPos;
    },
    getCountHP:function () {
        return this.countHP;
    },

    getCountDestroyFrame:function () {
        return this.countDestroy;
    },

    showHouseGetDameUI:function () {

        if(this.houseGetDameUI == null) {
            this.houseGetDameUI = new sp.SkeletonAnimation("res/battle/fx/enemy_circle.json",
                "res/battle/fx/enemy_circle.atlas");
            this.houseGetDameUI.setPosition(winSize.width / 2, winSize.height / 2.5);
            this.houseGetDameUI.setScaleY(1.2);
            this.houseGetDameUI.setAnimation(0, "tower_get_hit_fx", false);
            GameUI.instance.addChild(this.houseGetDameUI, GAME_CONFIG.RENDER_START_Z_ORDER_VALUE+winSize.height);
        }else {
            this.houseGetDameUI.stopAllActions();
            this.houseGetDameUI.clearTracks();
            this.houseGetDameUI.opacity = 255;
            this.houseGetDameUI.setAnimation(0, "tower_get_hit_fx", false);
            let seq = cc.sequence(cc.delayTime(0.8), cc.fadeOut(0));
            this.houseGetDameUI.runAction(seq);
        }


    },

    updateHealth:function (amount) {
        if(this.rule === 1) {
            this.showHouseGetDameUI()
        }
        // this.houseGetDameUI.setAnimation(0, "field_red", false)
        this.health += amount
        if (this.health < 0) {
            this.health = 0
        }

    },
    updateEnergy: function (amount) {
        this.energy += amount
        if (this.energy < 0) {
            this.energy = 0
        }
        if(this.energy > GAME_CONFIG.MAX_ENERGY){
            this.energy = GAME_CONFIG.MAX_ENERGY
        }
    },
    readFrom: function (bf) {
        bf.getInt();
        bf.getInt();
        for (var y = 0; y < MAP_CONFIG.MAP_HEIGHT; y++) {
            for (var x = 0; x < MAP_CONFIG.MAP_WIDTH; x++) {
                var tmp =  bf.getInt();
                if(tmp == 0) this.intArray[x][y] = 0;
                if(tmp == 1) this.intArray[x][y] = 0;
                if(tmp == 2) this.intArray[x][y] = 0;
                if(tmp == 3) this.intArray[x][y] = cf.MAP_CELL.TREE;
                if(tmp == 4) this.intArray[x][y] = 0
                if(tmp == 5) this.intArray[x][y] = cf.MAP_CELL.HOLE;
                if(tmp == 6) this.intArray[x][y] = cf.MAP_CELL.BUFF_DAMAGE;
                if(tmp == 7) this.intArray[x][y] = cf.MAP_CELL.BUFF_ATTACK_SPEED;
                if(tmp == 8) this.intArray[x][y] = cf.MAP_CELL.BUFF_RANGE;
            }
        }
        this._map = new MapView(this, this.intArray, this.rule)
    },

    spawnNextMonster: function () {
        this.monstersToSpawn.shift()
        const isCardMonster = this.isCardMonsters.shift()
        const id = this.monstersIdToSpawn.shift()
        const hpMul = this.monstersHpMulToSpawn.shift()
        const m1 = this.gameStateManager.monsterFactory.getMonster(this, id)
        m1.health = m1.health * hpMul
        m1.MaxHealth = m1.MaxHealth * hpMul

        if (isCardMonster) {
            m1.energyFromDestroy = 0
            m1.addCircleUI()
        }

        let monsterShadow = null
        if (isCardMonster) {
            const playerA = this.gameStateManager.playerA
            if (playerA === this) {
                monsterShadow = new cc.Sprite(res.oval_grey)
            } else {
                monsterShadow = new cc.Sprite(res.oval_grey)
            }
        } else {
            monsterShadow = new cc.Sprite(res.oval_grey)
        }

        //monsterShadow.scale.x = 0.8
        //monsterShadow.scale.y = 0.8

        //monsterShadow.setScale(0.8, 0.8)
        monsterShadow.opacity = 128
        m1.shadowSprite = monsterShadow

        this._map.addMonster(m1)
        GameUI.instance.addChild(m1)
        GameUI.instance.addChild(monsterShadow)
    },

    update: function (dt) {
        if ((this.timePerMonster -= dt) <= 0) {
            if (this.monstersIdToSpawn.length !== 0) {
                //this._map.monsters.push(this.monstersToSpawn.shift())
                //this._map.addMonster(this.monstersToSpawn.shift())
                this.spawnNextMonster()
            }

            this.timePerMonster = this.timePerMonsterMax
        }

        this._map.update(dt)
    },

    getMap: function () {
        return this._map
    },

    //addMonster: function (monster) {
        //this._map.monsters.push(monster)
        //return monster

        //this.monstersToSpawn.push(monster)

    //},

    addMonsterId: function (monsterId, hpMul, isCreateFromCard = false) {
        // cc.log('ccccccccccccccccccccccccccc')
        this.monstersToSpawn.push(0)
        this.monstersIdToSpawn.push(monsterId)
        this.monstersHpMulToSpawn.push(hpMul)
        this.isCardMonsters.push(isCreateFromCard)
    },

    isClearWave: function () {
        return this.monstersToSpawn.length === 0 && this._map.monsters.size() === 0 //.length === 0
    },

    activateNextWave: function (ui, monsterFactory, monstersId) {
        const other = (this === this.gameStateManager.playerA ? this.gameStateManager.playerB : this.gameStateManager.playerA)
        const totalTowersLv = MonsterWaveHandler.getTotalTowersLv(other.getMap());
        // cc.log('+++++++++++>    ' + totalTowersLv)
        const hpMul = MonsterWaveHandler.getMonsterHpMultiplier(totalTowersLv);
        // cc.log('===========>    ' + hpMul)
        //let date = Date.now()
        for (let i = 0; i < monstersId.length; i++) {
            // let date2 = Date.now()
            //const m1 = monsterFactory.getMonster(this, monstersId[i])
            //m1.health = m1.health * hpMul
            //m1.MaxHealth = m1.MaxHealth * hpMul
            //this.addMonster(m1)

            this.addMonsterId(monstersId[i], hpMul)

            //m1.visible = false
            //ui.addChild(m1)
            // cc.log("\n\n=>>>>> time function addMonster = "+(Date.now() - date2))
        }
        // cc.log("\n\n=>>>>> time function addMonster = "+(Date.now() - date))
    }

});
