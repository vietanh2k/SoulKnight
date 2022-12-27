const convertIndexToPos = function (corX, corY, rule) {
    var x, y
    if (rule === 1) {
        x = winSize.width / 2 - WIDTHSIZE / 2 + (corX + 1) * CELLWIDTH
        y = winSize.height / 2 - HEIGHTSIZE / 2 + (MAP_CONFIG.MAP_HEIGHT - corY + 3.5) * CELLWIDTH
    } else {
        x = winSize.width / 2 - WIDTHSIZE / 2 + (7 - corX) * CELLWIDTH
        y = winSize.height / 2 - HEIGHTSIZE / 2 + (MAP_CONFIG.MAP_HEIGHT + corY + 3.5) * CELLWIDTH
    }
    return new cc.p(x, y)
};

const convertPosToIndex = function (pos, rule) {
    var x, y
    if (rule === 1) {
        x = Math.floor((pos.x - winSize.width / 2 + WIDTHSIZE / 2) / CELLWIDTH - 0.5)
        y = Math.floor(MAP_CONFIG.MAP_HEIGHT + 3.5 - (pos.y - winSize.height / 2 + HEIGHTSIZE / 2) / CELLWIDTH + 0.5)
    } else if (rule === 2) {
        x = Math.floor(MAP_CONFIG.MAP_WIDTH - (pos.x - winSize.width / 2 + WIDTHSIZE / 2) / CELLWIDTH + 0.5)
        y = Math.floor((pos.y - winSize.height / 2 + HEIGHTSIZE / 2) / CELLWIDTH - MAP_CONFIG.MAP_HEIGHT - 3.5 + 0.5)
    } else {
        cc.log('invalid rule: ' + rule);
        return null;
    }
    return new cc.p(x, y)
};

const convertIndexToMapPos = function (index) {
    return new cc.p(
        MAP_CONFIG.CELL_WIDTH / 2 + index.x * MAP_CONFIG.CELL_WIDTH,
        -MAP_CONFIG.CELL_HEIGHT / 2 + index.y * MAP_CONFIG.CELL_HEIGHT
    );
};

const convertMapPosToIndex = function (pos) {
    return new cc.p(
        Math.floor(pos.x / MAP_CONFIG.CELL_WIDTH),
        Math.floor(pos.y / MAP_CONFIG.CELL_HEIGHT) + 1
    );
};

const isCorInMap = function (cor) {
    return cor.x >= 0 && cor.x <= MAP_CONFIG.MAP_WIDTH - 1 && cor.y >= 1 && cor.y <= MAP_CONFIG.MAP_HEIGHT;
};

const isPosInMap = function (pos, rule) {
    let cor = convertPosToIndex(pos, rule);
    return isCorInMap(cor);
};

const getMiddleOfCell = function (loc, rule) {
    let cor = convertPosToIndex(loc, rule);
    return convertIndexToPos(cor.x, cor.y, rule);
};

/*
xem cast trên màn hình là tại map 1 hay map 2
1 - map mình
2 - map enemy
 */
const getMapCastAt = function (posUI) {
    if(isPosInMap(posUI , 1)){
        return 1;
    }
    if(isPosInMap(posUI , 2)){
        return 2;
    }
};

/*
map mà card có thể active
1: player
2: enemy
3: both
 */
const getRule = function (target) {
    switch (target.type) {
        case 16:
        case 17:
        case 18:
        case 0:
        case 19:
        case 20:
        case 21:
        case 22:
        case 5:
        case 7:
            return 1;
        case 4:
        case 6:
        case 2:
        case 3:
            return 2;
        case 1:
            return 3; // fixme
        default:
            break;
    }
};

const getIdMonsterByTypeCard = function (typeCard) {
    switch (typeCard) {
        case 4:
            return 0;
        case 5:
            return 1;
        case 6:
            return 2;
        case 7:
            return 3;
        case 8:
            return 4;
        default:
            return 1;
    }
};

const getBaseMonsterByID = function (monsterID) {
    switch (monsterID) {
        case 0:
            return 3;
        case 1:
            return 3;
        case 2:
            return 1;
        case 3:
            return 3;
        case 4:
            return 3;
        default:
            return 1;
    }
};

const getMulByLvlTower = function (lvlTower) {
    switch (Math.floor(lvlTower/5)) {
        case 0:
            return 1;
        case 1:
            return 2;
        case 2:
            return 3;
        case 3:
            return 4;
        case 4:
            return 5;
        case 5:
            return 6;
        case 6:
            return 7;
        default:
            return 7;
    }
};

const convertLogicalPosToIndex = function (pos, rule) {
    let x = Math.floor((pos.x - MAP_CONFIG.CELL_WIDTH / 2.0) / MAP_CONFIG.CELL_WIDTH),
        y = 1 + Math.floor((pos.y - MAP_CONFIG.CELL_HEIGHT / 2.0) / MAP_CONFIG.CELL_HEIGHT);
    return cc.p(x, y)

};

const convertPosUIToLocLogic = function (pos, rule) {
    if(rule === 1) {
        var corX = (pos.x - winSize.width / 2 + WIDTHSIZE / 2) / CELLWIDTH - 1
        var corY = MAP_CONFIG.MAP_HEIGHT + 3.5 - (pos.y - winSize.height / 2 + HEIGHTSIZE / 2) / CELLWIDTH
        var p = new Vec2(corX, corY)
        return p
    }
    if(rule === 2){
        var corX = MAP_CONFIG.MAP_WIDTH - (pos.x - winSize.width / 2 + WIDTHSIZE / 2) / CELLWIDTH
        var corY = (pos.y - winSize.height / 2 + HEIGHTSIZE / 2) / CELLWIDTH - MAP_CONFIG.MAP_HEIGHT - 3.5
        var p = new Vec2(corX, corY)
        return p
    }
};

const convertPosLogicToPosUI = function (posLogic, rule) {

        let indX = (posLogic.x - MAP_CONFIG.CELL_WIDTH / 2.0) / MAP_CONFIG.CELL_WIDTH,
            indY = (posLogic.y - MAP_CONFIG.CELL_HEIGHT / 2.0) / MAP_CONFIG.CELL_HEIGHT+1;
    if(rule == 1){
        let posX = winSize.width / 2 - WIDTHSIZE / 2 + (indX + 1) * CELLWIDTH,
            posY = winSize.height / 2 - HEIGHTSIZE / 2 + (MAP_CONFIG.MAP_HEIGHT - indY + 3.5) * CELLWIDTH
        return new Vec2(posX,posY)
    }
    else {
        let posX = winSize.width / 2 - WIDTHSIZE / 2 + (7 - indX) * CELLWIDTH,
            posY = winSize.height / 2 - HEIGHTSIZE / 2 + (MAP_CONFIG.MAP_HEIGHT + indY + 3.5) * CELLWIDTH
        return new Vec2(posX,posY)
    }
};
