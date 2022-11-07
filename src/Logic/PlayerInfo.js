var PlayerInfo = cc.Class.extend({
    ctor: function (byte_buffer) {
        this.id = byte_buffer.getInt();
        this.name = byte_buffer.getString();
        this.gold = byte_buffer.getInt();
        this.gem = byte_buffer.getInt();
        this.trophy = byte_buffer.getInt();
        var collection_size = byte_buffer.getInt(), i;
        this.collection = [];
        for (i = 0; i < collection_size; i++) {
            this.collection.push(new Card(byte_buffer))
        }
        var chest_size = byte_buffer.getInt();
        this.onWaitingChestList = []
        for (i = 0; i < chest_size; i++) {
            this.onWaitingChestList.push(new Chest(byte_buffer))
        }
        cc.log(JSON.stringify(this))
        var deck_size = byte_buffer.getInt();
        cc.log(deck_size)
        this.deck = []
        for (i = 0; i < 3; i++) {
            this.deck.push(new Card(byte_buffer))
        }
        // cc.log(JSON.stringify(this))
    }
    // todo: thêm các hàm

})

var sharePlayerInfo;