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

    addNewCards: function (newCards) {
        for (let i = 0; i < newCards.length; i++) {
            let card = sharePlayerInfo.collection.find(card => card.id === newCards[i].id);
            card.fragment += newCards[i].fragment;
        }
        cc.director.getRunningScene().tabUIs[cf.LOBBY_TAB_CARDS].updateAllCardSlots();
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
})

var sharePlayerInfo;
