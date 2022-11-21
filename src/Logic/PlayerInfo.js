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
    },

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

    /**
     * Thêm các thẻ mới vào collection.
     *
     * @param {Card[]} newCards danh sách CHỨA các thẻ sau khi được cập nhật bên server (ĐÂY LÀ TRẠNG THÁI SAU CẬP NHẬT, KHÔNG PHẢI ĐƯỢC THÊM VÀO, KHÔNG PHẢI DANH SÁCH TOÀN BỘ THẺ MÀ CHỈ LÀ CÁC THẺ ĐƯỢC THÊM MỚI HOẶC TẠO MỚI)
     * @return {void}
     */
    addNewCards: function (newCards) {
        for (let i = 0; i < newCards.length; i++) {
            let j = 0;
            for (j = 0; j < sharePlayerInfo.collection.length; j++) {
                if (newCards[i].type === sharePlayerInfo.collection[j].type) {
                    sharePlayerInfo.collection[j] = newCards[i];
                    for (let k = 0; k < sharePlayerInfo.deck.length; k++) {
                        if (newCards[i].type === sharePlayerInfo.deck[k].type) {
                            sharePlayerInfo.deck[k] = newCards[i];
                            break;
                        }
                    }
                    break;
                }
            }
            if (j === sharePlayerInfo.collection.length) {
                sharePlayerInfo.collection.push(newCards[i]);
            }
        }
        LobbyInstant.tabUIs[cf.LOBBY_TAB_CARDS].updateAllCardSlots();
    },

    /**
     * Sort collection by energy, ascending or descending order.
     *
     * @param {boolean} isAscOrder sort by ascending order?
     * @return {void}
     */
    sortCollectionByEnergy: function (isAscOrder) {
        this.collection.sort((a, b) => (a.energy - b.energy) * (2 * isAscOrder - 1));
    },

    updateDeckAfterSwapCard: function (typeIn, typeOut) {
        let cardIn = this.collection.find(card => card.type === typeIn);
        if (cardIn === undefined) {
            cc.log('Cannot find typeIn ' + typeIn + ' in collection');
            return;
        }
        for (let i = 0; i < this.deck.length; i++) {
            if (this.deck[i].type === typeOut) {
                this.deck[i] = cardIn;
                return;
            }
        }
        cc.log('Cannot find typeOut ' + typeOut + ' in collection');
    },

    removeChest: function (chestID) {
        let i;
        for (i = 0; i < this.chestList.length; i++) {
            if (this.chestList[i].id === chestID) {
                break;
            }
        }
        if (i === this.chestList.length) {
            cc.log('Cannot find chest id ' + chestID + ' in sharePlayerInfo.');
        } else {
            this.chestList.splice(i, 1);
        }
    },
})

var sharePlayerInfo;
