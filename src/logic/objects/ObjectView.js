/**
 * Đối tượng Map trong thiết kế
 * */

var  ObjectView = cc.Class.extend({
    ctor:function () {
        this._map = null;
        this.listBlock = [];
        this.enemys = new UnorderedList() //[]
        this.bullets  = new UnorderedList() //[]
        this.spells   = new UnorderedList() //[]
        this.effects  = new UnorderedList()
        this.items  = new UnorderedList()
        this.character = null;


    },

    queryEnemiesCircle: function (pos, radius) {
        const self = this
        const monsters = []

        const x1 = Math.floor((pos.x - radius) / MAP_CONFIG.CELL_WIDTH)
        const x2 = Math.ceil((pos.x + radius) / MAP_CONFIG.CELL_WIDTH)

        const y1 = Math.floor((pos.y - radius) / MAP_CONFIG.CELL_HEIGHT)
        const y2 = Math.ceil((pos.y + radius) / MAP_CONFIG.CELL_HEIGHT)

        for (let x = x1; x < x2; x++) {
            for (let y = y1; y < y2; y++) {
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

    getEnemyColisionInMap: function (p0, p1) {
        let GiaoDiem = null;
        let disMin = 99999;
        let retEnemy = null;
        let dis1 = cc.pDistance(p0, p1);
        let objInRange = [];

        this.enemys.forEach(enemy=>{
            if(enemy) {
                let gd = null;
                let posEnemy = new cc.p(enemy.posLogic.x, enemy.posLogic.y);
                if (cc.pDistance(p1, posEnemy) > (dis1 + GAME_CONFIG.CELLSIZE)) return;
                let g1 = isPointInsideHCN(p1, posEnemy, 50, 80);
                if(g1 != null) {
                    gd = g1;
                }else{
                    let g2 = getColisionDoanThangVaHCN(p0, p1, posEnemy, 50, 80);
                    if(g2 != null) gd = g2;
                }
                if (gd != null) {
                    let dis = cc.pDistance(p0, gd);
                    if (dis < disMin) {
                        GiaoDiem = gd;
                        disMin = dis;
                        retEnemy = enemy;
                    }
                }
            }
        })
        // for(var i=0; i<this.enemys.size(); i++){
        //     let enemy = this.enemys.get(i);
        //     if(enemy) {
        //         let posEnemy = new cc.p(enemy.posLogic.x, enemy.posLogic.y);
        //         if (cc.pDistance(p1, posEnemy) > (dis1 + GAME_CONFIG.CELLSIZE)) continue;
        //         let gd = getColisionDoanThangVaHCN(p0, p1, posEnemy, 50, 80);
        //         if (gd != null) {
        //             let dis = cc.pDistance(p0, gd);
        //             if (dis < disMin) {
        //                 GiaoDiem = gd;
        //                 disMin = dis;
        //                 retEnemy = enemy;
        //             }
        //         }
        //     }
        // }
        if(GiaoDiem != null) {
            return [GiaoDiem, retEnemy];
        }
        return null;
    },

    getBlockColisionInMap: function (p00, p11) {

        let p0 = getIntVector(p00);
        let p1 = getIntVector(p11);
        let GiaoDiem = null;
        let disMin = 99999;
        let dis1 = cc.pDistance(p0, p1);
        for (let i=0; i<this.listBlock.length; i++){
            let gd = null;
            let posBlock = convertIndexToPosLogic(this.listBlock[i].x, this.listBlock[i].y);
            if(cc.pDistance(p1, posBlock) > (dis1+GAME_CONFIG.CELLSIZE)) continue;
            let g1 = isPointInsideHCN(p1, posBlock, GAME_CONFIG.CELLSIZE, GAME_CONFIG.CELLSIZE);
            if(g1 != null) gd = g1;
            let g2 = getColisionDoanThangVaHCN(p0, p1, posBlock, GAME_CONFIG.CELLSIZE, GAME_CONFIG.CELLSIZE);
            if(g2 != null) gd = g2;
            if(gd != null){
                let dis = cc.pDistance(p0, gd);
                if (dis < disMin) {
                    GiaoDiem = gd;
                    disMin = dis;
                }
            }
        }
        return GiaoDiem;
    },

    getBlockInMap: function (p0, p1) {
        this.listBlock = [];
        for(var i=1; i<MAP_WIDTH; i++){
            for(var j=1; j<MAP_HEIGHT; j++){
                if(this._map.mapArray[i][j] === 1){
                    this.listBlock.push(new cc.p(i,j));
                }
            }
        }
        cc.log("list "+this.listBlock.length)
    },

    getClosestEnemy: function (disLogic) {
        let retEnemy = null;
        let disMin = 9999;
        this.enemys.forEach(enemy=>{
            if(enemy) {
                let posEnemy = new cc.p(enemy.posLogic.x, enemy.posLogic.y);
                let dis = cc.pDistance(this.character.posLogic, posEnemy);
                if (dis > (disLogic)) return;
                if (dis < disMin) {
                    disMin = dis;
                    retEnemy = enemy;
                }
            }
        })
        // for(var i=0; i<this.enemys.size(); i++){
        //     let enemy = this.enemys.get(i);
        //     if(enemy) {
        //         let posEnemy = new cc.p(enemy.posLogic.x, enemy.posLogic.y);
        //         let dis = cc.pDistance(this.character.posLogic, posEnemy);
        //         if (dis > (disLogic)) continue;
        //         if (dis < disMin) {
        //             disMin = dis;
        //             retEnemy = enemy;
        //             cc.log("true")
        //         }
        //         cc.log("false")
        //     }
        //     cc.log("false2")
        // }
        return retEnemy;
    },



    updateMap: function (map) {
        this._map = map;
        this.getBlockInMap();
    },

    addChar: function (char) {
        this.character = char;
    },

    addBullet: function (bullet) {
        bullet.mapId = this.bullets.add(bullet)
        if(BackgroundLayerInstance!= null)
        BackgroundLayerInstance.addChild(bullet)
    },

    addItem: function (item) {
        item.mapId = this.items.add(item)
        if(BackgroundLayerInstance!= null)
            BackgroundLayerInstance.addChild(item)
    },

    addEnemy: function (enemy) {
        enemy.mapId = this.enemys.add(enemy)
        if(BackgroundLayerInstance!= null)
            BackgroundLayerInstance.addChild(enemy)
    },

    update:function (dt) {
        this.updateChar(dt)
        this.updateBullet(dt)
        this.updateEnemy(dt)
        this.updateItem(dt)


        this.renderChar(0)
        this.renderBullet(0)
        this.renderEnemy(0)
        this.renderItem(0)

    },

    updateItem:function (dt) {
        try {
            let disMin = GAME_CONFIG.ITEM_DIS_MIN;
            let itemMin = null;
            this.items.forEach((item, id, list) => {

                if(item.isDestroy){
                    cc.log("destroy")
                    // cc.log(this.items.size())
                    list.remove(id)
                    cc.log(this.items.size())
                    return;
                }

                item.hideActive()
                item.logicUpdate(dt)
                let dis = cc.pDistance(item.posLogic, this.character.posLogic);
                if (dis < disMin){
                    disMin = dis;
                    itemMin = item;
                }
            })

            if(itemMin !== null){
                itemMin.showActive();
            }
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    updateBullet:function (dt) {
        try {
            this.bullets.forEach((bullet, id, list) => {
                bullet.logicUpdate(dt)

                if(bullet.isDestroy){
                    list.remove(id)
                }
            })
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    updateChar:function (dt) {
        try {
            if(this.character != null){
                this.character.logicUpdate(dt);
            }

        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    updateEnemy:function (dt) {
        try {
            this.enemys.forEach((enemy, id, list) => {
                enemy.logicUpdate(dt)

                if(enemy.isDestroy){
                    list.remove(id)
                    if(this.enemys.size() === 0){
                        // GamelayerInstance.isStop = true;
                        BackgroundLayerInstance.initDoor();
                    }
                }
            })
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }

    },

    renderBullet: function () {
        /*for (i in this.bullets){
            this.bullets[i].render(this._playerState)
        }*/
        const self = this
        this.bullets.forEach((bullet, id, list) => {
            // bullet.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + bullet.posLogic.y)
            bullet.render()
        })
    },

    renderChar: function () {

        const self = this
        // this.character.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + this.character.posLogic.y)
        this.character.render()
    },

    renderEnemy: function () {
        /*for (i in this.bullets){
            this.bullets[i].render(this._playerState)
        }*/
        const self = this
        this.enemys.forEach((enemy, id, list) => {
            // bullet.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + bullet.posLogic.y)
            enemy.render()
        })
    },

    renderItem: function () {
        /*for (i in this.bullets){
            this.bullets[i].render(this._playerState)
        }*/
        const self = this
        this.items.forEach((item, id, list) => {
            // bullet.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + bullet.posLogic.y)
            item.render()
        })
    },

    saveObject: function () {
        this.items.forEach((item, id, list) => {
            // bullet.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + bullet.posLogic.y)
            item.retain();
            item.removeFromParent(true);
        })
    },

    getObjectFromSave: function () {
        this.getBlockInMap();
        this.items.forEach((item, id, list) => {
            // bullet.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + bullet.posLogic.y)
            if(BackgroundLayerInstance!= null)
                BackgroundLayerInstance.addChild(item)
        })
    },


});
