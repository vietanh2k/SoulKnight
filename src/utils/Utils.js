var Utils = Utils || {};

Utils.toStringWithDots = function (number) {
    let res = number.toString();
    let counter = 3;
    for (let i = res.length; i > 0; i--) {
        if (counter > 0) {
            counter--;
        } else {
            res = res.slice(0, i) + '.' + res.slice(i);
            counter = 3;
            i++;
        }
    }
    return res;
}

Utils.create2dArr = (x, y, defaultValue) => {
    let res = [];
    for (let i = 0; i < x; i++) {
        let tmp = [];
        for (let j = 0; j < y; j++) {
            tmp.push(defaultValue);
        }
        res.push(tmp);
    }
    return res;
};

Utils.milisecondsToReadableTime = function (ms) {
    let sec = Math.ceil(ms / 1000);
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec - h * 3600) / 60);
    let s = sec - h * 3600 - m * 60;
    if (h > 0) {
        if (m === 0) {
            return '' + h + 'h';
        } else {
            return '' + h + 'h ' + m + 'm';
        }
    } else if (m > 0) {
        if (s === 0) {
            return '' + m + 'm';
        } else {
            return '' + m + 'm ' + s + 's';
        }
    } else {
        return '' + s + 's';
    }
}

Utils.getOpenTimeLeft = function (chest) {
    if (chest.openTimeStarted === null) return chest.openTimeRequired;
    return Math.max(0, chest.openTimeRequired - (Date.now() - chest.openTimeStarted));
}

Utils.gemCostToOpenChest = function (openTimeLeft) {
    if (openTimeLeft <= 0) return 0;
    return Math.ceil(openTimeLeft / (60 * 60 * 1000) * cf.COST_GEMS_PER_HOUR);
}

Utils.isOpening = function (chest) {
    if (chest.openTimeStarted === null) return false;
    return Utils.getOpenTimeLeft(chest) > 0;
}

Utils.updateTimeDiff = function (serverNow) {
    cf.TIME_DIFF = serverNow - Date.now();
    cc.log('Time diff updated: ' + cf.TIME_DIFF);
}

Utils.addToastToRunningScene = function (message) {
    cc.director.getRunningScene().addChild(new Toast(message), cf.TOAST_Z_ORDER);
}

Utils.loadCardConfig = function () {
    cc.loader.load('json/CardTypeMap.json', (err, res) => {
        cf.CARD_TYPE = res[0];
    });
    cc.loader.load('json/Monster.json', (err, res) => {
        cf.MONSTER = res[0];
    });
    cc.loader.load('json/Tower.json', (err, res) => {
        cf.TOWER = res[0];
    });
    cc.loader.load('json/Potion.json', (err, res) => {
        cf.POTION = res[0];
    });
}
