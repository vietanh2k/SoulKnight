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
};

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
};

Utils.getOpenTimeLeft = function (chest) {
    if (chest.openTimeStarted === null) return chest.openTimeRequired;
    return Math.max(0, chest.openTimeRequired - (Date.now() - chest.openTimeStarted));
}

Utils.gemCostToOpenChest = function (openTimeLeft) {
    if (openTimeLeft <= 0) return 0;
    return Math.ceil(openTimeLeft / (60 * 60 * 1000) * cf.COST_GEMS_PER_HOUR);
};

Utils.isOpening = function (chest) {
    if (chest.openTimeStarted === null) return false;
    return Utils.getOpenTimeLeft(chest) > 0;
};

Utils.updateTimeDiff = function (serverNow) {
    cf.TIME_DIFF = serverNow - Date.now();
    cc.log('Time diff updated: ' + cf.TIME_DIFF);
};

Utils.addToastToRunningScene = function (message) {
    if (fr.getCurrentScreen() != null || fr.getCurrentScreen() !== undefined) {
        fr.getCurrentScreen().addChild(new Toast(message), cf.TOAST_Z_ORDER);
    }
};

Utils.addScaleAnimation = function (obj) {
    obj.scale = 0.2;
    obj.runAction(cc.fadeIn(0.2));
    obj.runAction(cc.sequence(cc.scaleBy(0.15, 5), cc.scaleBy(0.10, 0.94), cc.scaleBy(0.08, 1.06), cc.scaleBy(0.07, 0.96), cc.scaleBy(0.05, 1.04)));
};

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
    cc.loader.load('json/TowerBuff.json', (err, res) => {
        cf.TOWER_BUFF = res[0];
    });
    cc.loader.load('json/TargetBuff.json', (err, res) => {
        cf.TARGET_BUFF = res[0];
    });
};

Utils.generateCardAttributes = function (card, index) {
    let texture, textAttribute, textStat, diff, textUpgradeStat = undefined;
    switch (card.statTypes[index]) {
        case 'hp':
            textAttribute = 'Máu:';
            texture = asset.statIcons_png['hp'];
            textStat = Math.round(card.hp * 100) / 100;
            diff = card.getNextLevelSample().hp - card.hp;
            if (diff > 0) {
                textUpgradeStat = '+' + Math.round(diff * 100) / 100;
            }
            break;
        case 'speed':
            textAttribute = 'Tốc chạy:';
            texture = asset.statIcons_png['speed'];
            textStat = Math.round(card.speed * 100) / 100;
            diff = card.getNextLevelSample().speed - card.speed;
            if (diff > 0) {
                textUpgradeStat = '+' + Math.round(diff * 100) / 100;
            }
            break;
        case 'numberMonsters':
            textAttribute = 'Số lượng:';
            texture = asset.statIcons_png['numberMonsters'];
            textStat = '' + card.minNumberMonsters + ' - ' + card.maxNumberMonsters;
            diff = card.getNextLevelSample().maxNumberMonsters - card.maxNumberMonsters;
            if (diff > 0) {
                textUpgradeStat = '+' + Math.round(diff);
            }
            break;
        case 'damage':
            textAttribute = 'Sát thương:';
            texture = asset.statIcons_png['damage'];
            textStat = Math.round(card.damage * 100) / 100;
            diff = card.getNextLevelSample().damage - card.damage;
            if (diff > 0) {
                textUpgradeStat = '+' + Math.round(diff);
            }
            break;
        case 'attackSpeed':
            textAttribute = 'Tốc bắn: ';
            texture = asset.statIcons_png['attackSpeed'];
            textStat = Math.round(1000 / card.towerInfo.stat[card.evolution + 1].attackSpeed * 100) / 100;
            if (card.evolution < 2) {
                diff = 1000 / card.towerInfo.stat[card.evolution + 2].attackSpeed - 1000 / card.towerInfo.stat[card.evolution + 1].attackSpeed;
                if (diff > 0) {
                    textUpgradeStat = '+' + Math.round((diff) * 100) / 100;
                } else if (diff < 0) {
                    textUpgradeStat = '-' + Math.round((-diff) * 100) / 100;
                }
            }
            break;
        case 'range':
            textAttribute = 'Tầm bắn: ';
            texture = asset.statIcons_png['range'];
            textStat = Math.round(card.towerInfo.stat[card.evolution + 1].range * 100) / 100;
            if (card.evolution < 2) {
                diff = card.towerInfo.stat[card.evolution + 2].range - card.towerInfo.stat[card.evolution + 1].range;
                if (diff > 0) {
                    textUpgradeStat = '+' + Math.round((diff) * 100) / 100;
                } else if (diff < 0) {
                    textUpgradeStat = '-' + Math.round((-diff) * 100) / 100;
                }
            }
            break;
        case 'bulletType':
            textAttribute = 'Loại bắn: ';
            texture = asset.statIcons_png['bulletRadius'];
            textStat = cf.BULLET_TYPES_LOCALIZE[card.towerInfo.bulletType];
            break;
        case 'bulletTargetBuffType': {
            let targetBuffConfig = cf.TARGET_BUFF.targetBuff[card.towerInfo.bulletTargetBuffType];
            switch (targetBuffConfig.name) {
                case 'bulletOilGun':
                    textAttribute = 'T. G. làm chậm:';
                    texture = asset.statIcons_png['immobilize'];
                    break;
                case 'bulletIceGun':
                    textAttribute = 'T. G. đóng băng:';
                    texture = asset.statIcons_png['immobilize'];
                    break;
                default:
                    cc.log('Target buff name not found!');
                    break;
            }
            textStat = Math.round(targetBuffConfig.duration[card.evolution + 1] / 1000);
            if (card.evolution < 2) {
                diff = targetBuffConfig.duration[card.evolution + 2] / 1000 - targetBuffConfig.duration[card.evolution + 1] / 1000;
                if (diff > 0) {
                    textUpgradeStat = '+' + Math.round((diff) * 100) / 100;
                } else if (diff < 0) {
                    textUpgradeStat = '-' + Math.round((-diff) * 100) / 100;
                }
            }
            textStat = '' + textStat + 's';
            break;
        }
        case 'auraTowerBuffType': {
            let towerBuffConfig = cf.TOWER_BUFF.towerBuff[card.towerInfo.auraTowerBuffType];
            switch (towerBuffConfig.name) {
                case 'attackAura - goatAura':
                    textAttribute = 'S. thương tăng:';
                    texture = asset.statIcons_png['damageUp'];
                    break;
                case 'attackSpeedAura - snakeAura':
                    textAttribute = 'Tốc bắn tăng:';
                    texture = asset.statIcons_png['attackSpeedUp'];
                    break;
                default:
                    cc.log('Target buff name not found!');
                    break;
            }
            textStat = Math.round(towerBuffConfig.effects[card.evolution + 1][0].value * 100) / 100;
            if (card.evolution < 2) {
                diff = towerBuffConfig.effects[card.evolution + 2][0].value - towerBuffConfig.effects[card.evolution + 1][0].value;
                if (diff > 0) {
                    textUpgradeStat = '+' + Math.round((diff) * 100) / 100;
                } else if (diff < 0) {
                    textUpgradeStat = '-' + Math.round((-diff) * 100) / 100;
                }
            }
            break;
        }
        case 'potionRange':
            textAttribute = 'Khoảng t. dụng:';
            texture = asset.statIcons_png['potionRange'];
            textStat = Math.round(card.potionRange * 100) / 100;
            diff = card.getNextLevelSample().potionRange - card.potionRange;
            if (diff > 0) {
                textUpgradeStat = '+' + Math.round(diff * 100) / 100;
            }
            break;
        case 'duration':
            textAttribute = 'Thời gian TD:';
            texture = asset.statIcons_png['time'];
            textStat = '' + Math.round(card.duration * 100) / 100 + 's';
            diff = card.getNextLevelSample().duration - card.duration;
            if (diff > 0) {
                textUpgradeStat = '+' + Math.round(diff * 100) / 100;
            }
            break;
        case 'heal':
            textAttribute = 'Hồi máu:';
            texture = asset.statIcons_png['heal'];
            textStat = '' + Math.round(card.heal * 100) / 100 + '/s';
            diff = card.getNextLevelSample().heal - card.heal;
            if (diff > 0) {
                textUpgradeStat = '+' + Math.round(diff * 100) / 100;
            }
            break;
        case 'strengthIncrease':
            textAttribute = 'Sát thương tăng:';
            texture = asset.statIcons_png['damageUp'];
            textStat = '' + Math.round(card.strengthIncrease * 100) + '%';
            diff = card.getNextLevelSample().strengthIncrease - card.strengthIncrease;
            if (diff > 0) {
                textUpgradeStat = '+' + Math.round(diff * 100) + '%';
            }
            break;
        default:
            cc.log('Cannot find case!');
            break;
    }

    return [texture, textAttribute, textStat, textUpgradeStat];
};

// Utils.convertPosUIToLocLogic = function (pos, rule) {
//     let corX = (pos.x - cf.WIDTH / 2 + WIDTHSIZE / 2) / CELLWIDTH - 1;
//     let corY = MAP_HEIGHT + 3.5 - (pos.y - cf.HEIGHT / 2 + HEIGHTSIZE / 2) / CELLWIDTH;
//     return new Vec2(corX, corY);
// };
