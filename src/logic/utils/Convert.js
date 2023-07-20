const convertIndexToPosLogic = function (corX, corY) {
    var x, y
    x = corX * GAME_CONFIG.CELLSIZE + GAME_CONFIG.CELLSIZE/2
    y = corY * GAME_CONFIG.CELLSIZE + GAME_CONFIG.CELLSIZE/2

    return new cc.p(x, y)
};

const convertPosLogicToIntIdx = function (posX, posY) {
    var x, y
    x = Math.floor((posX - GAME_CONFIG.CELLSIZE/2) / GAME_CONFIG.CELLSIZE + 0.5);
    y = Math.floor((posY - GAME_CONFIG.CELLSIZE/2) / GAME_CONFIG.CELLSIZE + 0.5);

    return new cc.p(x, y)
};

const getIntVector = function (p) {
    let x = parseInt(p.x);
    let y = parseInt(p.y);
    return new cc.p(x, y)
};
