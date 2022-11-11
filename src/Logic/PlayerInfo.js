var PlayerInfo = cc.Class.extend({

    ctor: function (id, name, gold, gem, trophy, collection, chestList, deck) {
        this.id = id;
        this.name = name;
        this.gold = gold;
        this.gem = gem;
        this.trophy = trophy;
        this.collection = collection;
        this.chestList = chestList;
        this.deck = deck;

        // fake data
        // this.name = FAKE.name;
        // this.gold = FAKE.gold;
        // this.gem = FAKE.gem;
        // this.trophy = FAKE.trophy;
        // this.chestList = FAKE.chests;
    },

    /**
     * Trả về một đối tượng chest theo id truyền vào
     * @param {int} chestId: id của chest
     * @return {Chest} : chest tìm thấy hoặc null
     * */
    getChestById: function (chestId) {
        let rs = null;
        if (this.chestList != null) {
            this.chestList.map(function (chest) {
                if (chest.id === chestId) {
                    rs = chest;
                }
            })
        }
        return rs;
    },
})

var sharePlayerInfo;
