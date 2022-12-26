var Card = cc.Class.extend({

    ctor: function (type, level, fragment) {
        this.type = type;
        this.level = level;
        this.fragment = fragment;

        let cardTypeConfig = cf.CARD_TYPE[type];
        if (cardTypeConfig === undefined) {
            cc.log('WARNING: cardTypeConfig is undefined. Type is ' + type + '.');
        } else {
            this.instance = cardTypeConfig.instance;
            this.concept = cardTypeConfig.concept;
        }
        switch (this.concept) {
            case 'tower':
                this.towerInfo = cf.TOWER.tower[this.instance];
                break;
            case 'monster':
                this.monsterInfo = cf.MONSTER.monster[this.instance];
                this.minNumberMonsters = this.monsterInfo.numberMonsters;
                break;
            case 'potion':
                this.spellInfo = cf.POTION.potion[this.instance];
                break;
            default:
                cc.log('Card concept \"' + this.concept + '\" not found in config.')
                break;
        }

        this.id = this.generateCardId(this.concept, this.instance);

        let cardConfig = cf.CARD.find(element => element.id === this.id);
        if (cardConfig === undefined) {
            cc.log('WARNING: cardConfig is undefined');
        } else {
            this.energy = cardConfig.energy;
            this.texture = cardConfig.texture;
            this.miniature = cardConfig.miniature;
            this.statTypes = cardConfig.statTypes;
            this.skill = cardConfig.skill;
            this.name = cardConfig.name;
            this.description = cardConfig.description;
            if (this.isMonster()) {
                this.energyPerUnit = this.energy;
                this.energy *= this.minNumberMonsters;
            }
        }

        let levelConfig = cf.CARD_LEVEL.find(element => element.level === this.level);
        if (levelConfig === undefined) {
            cc.log('WARNING: levelConfig is undefined');
        } else {
            this.rarity = levelConfig.rarity;
            this.evolution = Math.min(this.rarity, 2);
        }
        if (this.level === 10) {
            this.reqGold = 0;
            this.reqFrag = 0;
        } else {
            let nextLevelConfig = cf.CARD_LEVEL.find(element => element.level === this.level + 1);
            if (nextLevelConfig === undefined) {
                cc.log('WARNING: nextLevelConfig is undefined');
            } else {
                this.reqGold = nextLevelConfig.gold;
                this.reqFrag = nextLevelConfig.fragment;
            }
        }

        if (this.isMonster()) {
            this.hp = cardConfig.hp * Math.pow(1.1, this.level - 1);
            this.speed = cardConfig.speed;
            if (this.rarity === 3) this.speed += 1;
            this.maxNumberMonsters = cardConfig.maxNumberMonsters[this.rarity];
        } else if (this.isTower()) {
            this.damage = this.towerInfo.stat[this.evolution + 1].damage * Math.pow(1.1, this.level - 1);
        } else if (this.isSpell()) {
            if (typeof cardConfig.potionRange === 'object') {
                this.potionRange = cardConfig.potionRange[this.rarity];
            }
            if (typeof cardConfig.damage === 'object') {
                this.damage = cardConfig.damage[this.level];
            }
            this.heal = cardConfig.heal;
            this.speedIncrease = cardConfig.speedIncrease;
            this.strengthIncrease = cardConfig.strengthIncrease;
            if (typeof cardConfig.duration === 'number') {
                this.duration = cardConfig.duration;
            } else if (typeof cardConfig.duration === 'object') {
                this.duration = cardConfig.duration[this.level];
            }
        }
    },

    generateCardId: function (concept, instance) {
        let id = 0;
        switch (concept) {
            case 'tower':
                id += 100;
                break;
            case 'monster':
                id += 200;
                break;
            case 'potion':
                id += 300;
                break;
            default:
                cc.log('Card concept \"' + concept + '\" not found in config.');
                return 0;
        }
        id += parseInt(instance);
        return id;
    },

    isTower: function () {
        return ('' + this.id)[0] === '1';
    },

    isMonster: function () {
        return ('' + this.id)[0] === '2';
    },

    isSpell: function () {
        return ('' + this.id)[0] === '3';
    },

    isInDeck: function () {
        let inDeck = sharePlayerInfo.deck.find(element => element.type === this.type);
        return inDeck !== undefined;
    },

    getTextType: function () {
        if (this.isMonster()) return 'Quái vật';
        if (this.isSpell()) return 'Phép thuật';
        if ([100, 101, 102].indexOf(this.id) !== -1) return 'Trụ c. đấu';
        if ([103, 104].indexOf(this.id) !== -1) return 'Trụ p. thuật';
        if ([105, 106].indexOf(this.id) !== -1) return 'Trụ hỗ trợ';
    },

    getNextLevelSample: function () {
        if (this.level === 10) {
            cc.log('Cannot get next level sample because level already maxed.');
            return this;
        }
        return new Card(this.type, this.level + 1, this.fragment - this.reqFrag);
    },

    getMaxUpgradeableLevel: function () {
        return this.evolution + 1;
    }
});
