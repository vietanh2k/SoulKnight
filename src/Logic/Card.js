var Card = cc.Class.extend({

    // ctor: function (id, name, type, level, quantity, attackSpeed, attackRange) {
    //     this.id = id;
    //     this.name = name;
    //     this.type = type;
    //     this.level = level;
    //     this.quantity = quantity;
    //     this.attackSpeed = attackSpeed;
    //     this.attackRange = attackRange;
    // },

    ctor: function (id, level, fragment) {
        this.id = id;
        this.level = level;
        this.fragment = fragment;

        let cardConfig = cf.CARD.find(element => element.id === this.id);
        if (cardConfig === undefined) {
            cc.log('WARNING: cardConfig is undefined');
        } else {
            this.energy = cardConfig.energy;
            this.texture = cardConfig.texture;
        }

        let levelConfig = cf.CARD_LEVEL.find(element => element.level === this.level);
        if (levelConfig === undefined) {
            cc.log('WARNING: levelConfig is undefined');
        } else {
            this.reqGold = levelConfig.gold;
            this.reqFrag = levelConfig.fragment;
            this.rarity = levelConfig.rarity;
        }
    },
});
