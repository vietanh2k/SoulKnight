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
                let g1 = isPointInsideHCN(p1, posEnemy, enemy.w1, enemy.h1);
                if(g1 != null) {
                    gd = g1;
                }else{
                    let g2 = getColisionDoanThangVaHCN(p0, p1, posEnemy, enemy.w1, enemy.h1);
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

    getBlockColisionInMap2: function (p00, p11) {

        let p0 = getIntVector(p00);
        let p1 = getIntVector(p11);
        let blockId = null;
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
                    blockId = [this.listBlock[i].x, this.listBlock[i].y];
                    GiaoDiem = gd;
                    disMin = dis;
                }
            }
        }
        return [GiaoDiem, blockId];
    },

    getBlockColisionInMap: function (p00, p11, disCheck = 0) {

        let p0 = getIntVector(p00);
        let p1 = getIntVector(p11);

        let pSub = cc.pSub(p1, p0);
        let blockId = null;
        let GiaoDiem = null;
        let dis1 = cc.pDistance(p0, p1);
        let disCheckCol = GAME_CONFIG.DIS_CHECK_COLISION;
        if(disCheck > 0){
            disCheckCol = disCheck;
        }
        // for tu A den B voi khoang cachs DIS_CHECK_COLISION
        for (let i = 0; i <= dis1+disCheckCol; i += disCheckCol){
            let t = 1
            if(dis1 !== 0) {
                t = i / dis1;     // t tu 0 toi 1
            }
            let curP = new cc.p(p0.x + pSub.x*t, p0.y + pSub.y*t);
            let curIdx = convertPosLogicToIntIdx(curP.x, curP.y);
            if(BackgroundLayerInstance.mapView.isBlock(curIdx.x, curIdx.y)){
                GiaoDiem = curP;
                blockId = [curIdx.x, curIdx.y];
                break;
            }

        }

        return [GiaoDiem, blockId];
    },

    getAllBlockColisionInMap: function (p00, p11) {

        let p0 = getIntVector(p00);
        let p1 = getIntVector(p11);
        let pSub = cc.pSub(p1, p0);
        let listBlockId = [];
        let dis1 = cc.pDistance(p0, p1);
        // for tu A den B voi khoang cachs DIS_CHECK_COLISION
        for (let i = 0; i <= dis1+GAME_CONFIG.DIS_CHECK_COLISION; i += GAME_CONFIG.DIS_CHECK_COLISION){
            let t = i/dis1;     // t tu 0 toi 1
            let curP = new cc.p(p0.x + pSub.x*t, p0.y + pSub.y*t);
            let curIdx = convertPosLogicToIntIdx(curP.x, curP.y);

            let check = false;
            for(var j=0; j<listBlockId.length; j++){
                if(listBlockId[j][0] === curIdx.x && listBlockId[j][1] === curIdx.y){
                    check = true;
                    break;
                }
            }
            if(check) continue;

            if(BackgroundLayerInstance.mapView.isBlock(curIdx.x, curIdx.y)){
                listBlockId.push([curIdx.x, curIdx.y]);
            }

        }

        return listBlockId;
    },

    getAllBlockColisionInMap2: function (p00, p11) {

        let p0 = getIntVector(p00);
        let p1 = getIntVector(p11);
        let listBlockId = [];
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
                listBlockId.push([this.listBlock[i].x, this.listBlock[i].y]);
            }
        }
        return listBlockId;
    },

    //list block va box
    getBlockInMap: function () {
        this.listBlock = [];
        for(var i=1; i<MAP_WIDTH; i++){
            for(var j=1; j<MAP_HEIGHT; j++){
                if(this._map.mapArray[i][j] === GAME_CONFIG.MAP_BLOCK || this._map.mapArray[i][j] === GAME_CONFIG.MAP_BOX || this._map.mapArray[i][j] > 0
                || this._map.mapArray[i][j] > 0
                ){
                    this.listBlock.push(new cc.p(i,j));
                }
            }
        }
        cc.log("list "+this.listBlock.length)
    },

    delBoxInMap: function (dx, dy) {
        for(var i=0; i<this.listBlock.length; i++) {
            let x = this.listBlock[i].x;
            let y = this.listBlock[i].y;
            if(x == dx && y == dy){
                this.listBlock.splice(i, 1);
                break;
            }

        }
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

    updateEffect: function (dt) {
        try {
            this.effects.forEach((effect, id, list) => {
                effect.logicUpdate(this._playerState, dt);

                if (effect.isDestroyed){
                    list.remove(id)
                }
            })
        } catch (e) {
            cc.log(e)
            cc.log(e.stack)
        }
    },

    addChar: function (char) {
        this.character = char;
    },

    addBullet: function (bullet) {
        bullet.mapId = this.bullets.add(bullet)
        if(BackgroundLayerInstance!= null)
        BackgroundLayerInstance.addChild(bullet)
    },

    addEffect: function (effect) {
        effect.mapId = this.effects.add(effect)
    },

    addItem: function (item) {
        item.mapId = this.items.add(item)
        if(BackgroundLayerInstance!= null)
            BackgroundLayerInstance.addChild(item)
    },

    addItemShop: function (itemShop) {
        let pos = new cc.p(itemShop.posLogic.x, itemShop.posLogic.y-10);
        let shopBack = new Item(10, 1, pos);
        this.addItem(shopBack);

        this.addItem(itemShop);
    },

    addEnemy: function (enemy) {
        enemy.mapId = this.enemys.add(enemy)
        if(BackgroundLayerInstance!= null)
            BackgroundLayerInstance.addChild(enemy)
    },

    update:function (dt) {
        let t1 = Date.now();
        this.updateChar(dt)
        let t2 = Date.now();
        // cc.log("char== "+ (t2-t1));
        this.updateBullet(dt)
        let t3 = Date.now();
        // cc.log("bullet== "+ (t3-t2))
        this.updateEnemy(dt)
        let t4 = Date.now();
        // cc.log("enemy== "+ (t4-t3))
        this.updateItem(dt)
        let t5 = Date.now();
        // cc.log("item== "+ (t5-t4))
        this.updateEffect(dt);
        let t6 = Date.now();
        // cc.log("eff== "+ (t6-t5))


        this.renderChar(0)
        this.renderBullet(0)
        this.renderEnemy(0)
        this.renderItem(0)

    },

    queryEnemiesCircle: function (posLogic, radius) {
        const ret = [];

        this.enemys.forEach((enemy, id, list) => {
            let dist = cc.pDistance(enemy.posLogic, posLogic);
            if (dist <= radius + enemy.radius) {
                ret.push(enemy);
            }
        })

        return ret
    },

    isCharInRangeCircle: function (posLogic, radius) {
        let ret = false;

        let dist = cc.pDistance(this.character.posLogic, posLogic);
        if (dist <= radius + this.character.radius) {
            ret = true;
        }

        return ret
    },

    queryBoxCircle: function (posLogic, radius) {
        const ret = [];

        let listBox = BackgroundLayerInstance.mapView.listBox
        Object.keys(listBox).forEach(key => {
            let box = listBox[key];
            let posBox = convertIndexToPosLogic(box.dx, box.dy);
            let dist = cc.pDistance(posBox, posLogic);
            if (dist <= radius + GAME_CONFIG.CELLSIZE/2) {
                ret.push(box);
            }
        });

        return ret
    },

    getAllObjectInCircle: function (posLogic, radius) {
        const ret = [];

        let enemys = this.queryEnemiesCircle(posLogic, radius);
        for (let i = 0; i < enemys.length; i++) {
            ret.push(enemys[i]);
        }

        if(this.isCharInRangeCircle(posLogic, radius)){
            ret.push(this.character);
        }

        let boxes = this.queryBoxCircle(posLogic, radius);
        for (let i = 0; i < boxes.length; i++) {
            ret.push(boxes[i]);
        }

        return ret
    },

    getAllPeopleInCircle: function (posLogic, radius) {
        const ret = [];

        let enemys = this.queryEnemiesCircle(posLogic, radius);
        for (let i = 0; i < enemys.length; i++) {
            ret.push(enemys[i]);
        }

        if(this.isCharInRangeCircle(posLogic, radius)){
            ret.push(this.character);
        }

        return ret
    },

    updateItem:function (dt) {
        try {
            if(BackgroundLayerInstance.state === GAME_CONFIG.STATE_FIGHTING) return;
            let disMin = GAME_CONFIG.ITEM_DIS_MIN;
            let itemMin = null;
            this.items.forEach((item, id, list) => {
                if(item.isNotActive){
                    return;
                }

                if(item.isDestroy){
                    cc.log("destroy")
                    // cc.log(this.items.size())
                    list.remove(id)
                    cc.log(this.items.size())
                    return;
                }

                // item.hideActive()
                item.logicUpdate(dt)
                let dis = cc.pDistance(item.posLogic, this.character.posLogic);
                if (dis < disMin){
                    disMin = dis;
                    itemMin = item;
                }
            })

            if(itemMin !== null){
                if(itemMin.isCanActive == false && BackgroundLayerInstance.curItem != null){
                    BackgroundLayerInstance.curItem.hideActive();
                }

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
                        BackgroundLayerInstance.state = GAME_CONFIG.STATE_MOVING;
                        setTimeout(()=>{
                            BackgroundLayerInstance.initAppear();
                        }, 500)
                        setTimeout(()=>{
                            BackgroundLayerInstance.initDoor();
                        }, 800)

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

        this.bullets.forEach((bullet, id, list) => {
            // bullet.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + bullet.posLogic.y)
            bullet.removeFromParent(true);
            list.remove(id);

        })

        this.bullets.forEach((bullet, id, list) => {
            // bullet.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + bullet.posLogic.y)
            bullet.removeFromParent(true);
            list.remove(id);

        })

        this.effects.forEach((effect, id, list) => {
            // bullet.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + bullet.posLogic.y)
            effect.destroy();
            list.remove(id);

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
