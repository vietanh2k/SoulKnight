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
            this.name = cardConfig.name;
            this.description = cardConfig.description;
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
});
