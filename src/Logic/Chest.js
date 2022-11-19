var Chest = cc.Class.extend({
    id: null,
    type: null,
    openOnServerTimestamp: null,
    golds: null,
    cards: null,
    rarities: null,
    openTimeRequired: null,
    openTimeStarted: null,
    openOnClientTimestamp: null,
    waitingOpenChestResponseWithGems: null,

    ctor: function (id, type, openOnServerTimestamp) {
        if (id < 0 || id > 3) {
            cc.log('ID KHÔNG HỢP LỆ! ID của rương là vị trí của nó trên HomeUI.');
        }
        this.id = id;
        this.type = type;
        this.type = 0; // theo config, hiện tại mới chỉ có 1 loại rương
        this.openOnServerTimestamp = openOnServerTimestamp;

        this.golds = cf.CHEST_REWARD[this.type].golds;
        this.cards = cf.CHEST_REWARD[this.type].cards;
        this.fragments = cf.CHEST_REWARD[this.type].fragments;
        this.rarities = cf.CHEST_REWARD[this.type].rarities;
    },

    updateClientTime: function () {
        this.openTimeRequired = cf.CHEST_REWARD[this.type].openTimeRequired;
        if (this.openOnServerTimestamp === cf.UNOPEN_CHEST_TIMESTAMP ||
            this.openOnServerTimestamp === cf.UNOPEN_CHEST_TIMESTAMP.toString()) {
            this.openTimeStarted = null;
        } else {
            this.openOnClientTimestamp = this.openOnServerTimestamp - cf.TIME_DIFF;
            this.openTimeStarted = this.openOnClientTimestamp - this.openTimeRequired;
        }
    },

    updateWhenStartToOpen: function (openOnServerTimestamp) {
        this.openOnServerTimestamp = openOnServerTimestamp;
        this.openOnClientTimestamp = this.openOnServerTimestamp - cf.TIME_DIFF;
        this.openTimeStarted = this.openOnClientTimestamp - this.openTimeRequired;
    },
});
