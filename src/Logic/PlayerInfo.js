var PlayerInfo = cc.Class.extend({
    ctor: function (byte_buffer) {
        this.id = byte_buffer.getInt();
        this.name = byte_buffer.getString();
        this.gold = byte_buffer.getInt();
        this.gem = byte_buffer.getInt();
        this.trophy = byte_buffer.getInt();
        let collectionSize = byte_buffer.getInt();
        this.collection = [];
        let i;
        for (i = 0; i < collectionSize; i++) {
            this.collection.push(new Card(byte_buffer));
        }
        let chestListSize = byte_buffer.getInt();
        this.chestList = [];
        for (i = 0; i < chestListSize; i++) {
            this.chestList.push(new Chest(byte_buffer));
        }
        let deckSize = byte_buffer.getInt();
        this.deck = [];
        for (i = 0; i < 3; i++) {
            this.deck.push(new Card(byte_buffer));
        }

        // fake data
        this.name = FAKE.name;
        this.gold = FAKE.gold;
        this.gem = FAKE.gem;
        this.trophy = FAKE.trophy;
    },
    // todo: thêm các hàm
    /**
     * Trả về một đối tượng chest theo id truyền vào
     * @param {int} chestId: id của chest
     * @return {Chest} : chest tìm thấy hoặc null
     * */
    getChestById: function (chestId) {
        var rs = null;
        if (this.onWaitingChestList != null) {
            this.onWaitingChestList.map(function (chest) {
                if (chest.id === chestId) {
                    rs = chest;
                }
            })
        }
        return rs;

    }

})

var sharePlayerInfo;