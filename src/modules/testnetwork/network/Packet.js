/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD || {};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.MOVE = 2001;
gv.CMD.OPEN_CHEST = 3001;
gv.CMD.OPEN_CHEST_NOW = 3001;
gv.CMD.START_COOLDOWN = 3002;
gv.CMD.UPDATE_PLAYER_INFO = 3003;
gv.CMD.OFFER_REQUEST = 3009;
gv.CMD.OFFER_RESPONSE = 3009;
gv.CMD.MATCH_REQUEST = 4001;
gv.CMD.MATCH_REPONSE = 4002;
gv.CMD.MATCH_CONFIRM = 4003;
gv.CMD.BATTLE_START = 5001;

gv.CMD.BATTLE_ACTIONS                               = 5009;
gv.CMD.BATTLE_SYNC_START                            = 5005;
gv.CMD.BATTLE_SYNC_START_CONFIRM                    = 5006;

gv.CMD.BATTLE_SYNC_CLIENT_UPDATE_TO_FRAME_N         = 5007;
gv.CMD.BATTLE_SYNC_CLIENT_UPDATE_TO_FRAME_N_CONFIRM = 5008;

testnetwork = testnetwork || {};
testnetwork.packetMap = {};


/** Outpacket */

//Handshake
CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
            this.setCmdId(gv.CMD.HAND_SHAKE);
        },
        putData: function () {
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
)
CmdSendUserInfo = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_INFO);
        },
        pack: function () {
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendOpenChest = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.OPEN_CHEST_NOW);
        },
        /**
         * send open chest request
         * sử dụng biến sharePlayerInfo.id
         * @param {Chest} chest: the chest to open*/
        putData: function (chest) {
            //pack
            this.packHeader();
            this.putInt(chest.id);
            this.putInt(sharePlayerInfo.id);
            //update
            this.updateSize();
        }
    }
)

CmdSendStartCoolDownChest = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.START_COOL_DOWN);
        },
        /**
         * send open START COOL DOWN request
         * sử dụng biến sharePlayerInfo.id
         * @param {Chest} chest: the chest to START OPENING*/
        putData: function (chest) {
            //pack
            this.packHeader();
            this.putInt(chest.id);
            this.putInt(sharePlayerInfo.id);
            //update
            this.updateSize();
        }
    }
)

CmdSendLogin = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_LOGIN);
        },
        pack: function (userId) {
            this.packHeader();
            this.putString("section");
            this.putInt(userId)
            this.updateSize();
        }
    }
)

CmdSendMove = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MOVE);
        },
        pack: function (direction) {
            this.packHeader();
            this.putShort(direction);
            this.updateSize();
        }
    }
)


CmdMatchRequest = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MATCH_REQUEST);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdMatchConfirm = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MATCH_CONFIRM);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdBattleActions = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.BATTLE_ACTIONS);
        },

        pack:function(actions){
            this.packHeader();

            this.putInt(actions.length)

            for (let i = 0; i < actions.length; i++) {
                this.putInt(actions[i].getActionPkgSize())
                this.putInt(actions[i].getActionCode())
                actions[i].writeTo(this)
            }

            this.updateSize();
        }
    }
)

CmdBattleSyncStartConfirm = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.BATTLE_SYNC_START_CONFIRM);
        },

        pack: function(syncN, frameN){
            this.packHeader();

            this.putLong(syncN)
            this.putLong(frameN)

            this.updateSize();
        }
    }
)

CmdBattleSyncClientUpdateToFrameNConfirm= fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.BATTLE_SYNC_CLIENT_UPDATE_TO_FRAME_N_CONFIRM);
        },

        pack: function(syncN){
            this.packHeader();
            this.putLong(syncN)
            this.updateSize();
        }
    }
)
CmdOfferRequest = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.OFFER_REQUEST);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)


/**
 * InPacket
 */

//Handshake
testnetwork.packetMap[gv.CMD.HAND_SHAKE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.token = this.getString();
        }
    }
);

testnetwork.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
        }
    }
);


testnetwork.packetMap[gv.CMD.USER_INFO] = fr.InPacket.extend({

    ctor: function () {
        this._super();
    },

    readData: function () {
        let id = this.getInt();
        let name = this.getString();
        let gold = this.getInt();
        let gem = this.getInt();
        let trophy = this.getInt();
        let collectionSize = this.getInt();
        let collection = [];
        for (let i = 0; i < 18; i++) { // fake data
            collection.push(this.readCardData(i)); // fake data
        }
        let chestListSize = this.getInt();
        let chestList = [];
        for (let i = 0; i < chestListSize; i++) {
            chestList.push(this.readChestData());
        }
        let deckSize = this.getInt();
        let deck = [];
        for (let i = 0; i < 8; i++) { // fake data
            deck.push(this.readCardTypeData(collection, i)); // fake data
        }

        let serverNow = this.getLong();
        Utils.updateTimeDiff(serverNow);
        chestList.forEach(chest => chest.updateClientTime());

        sharePlayerInfo = new PlayerInfo(id, name, gold, gem, trophy, collection, chestList, deck);
        cc.log("Received user data from server: " + JSON.stringify(sharePlayerInfo));
    },

    readCardData: function (i) { // fake data
        if (i < 10) { // fake data
            // let id = this.getInt();
            // let name = this.getString();
            let type = this.getByte();
            let level = this.getInt();
            let fragment = this.getInt();
            // let attackSpeed = this.getDouble();
            // let attackRange = this.getDouble();
        }
        // return new MCard(id, name, type, level, quantity, attackSpeed, attackRange);
        return new Card(fake.collection[i].id, fake.collection[i].level, fake.collection[i].fragment); // fake data
    },

    readChestData: function () {
        let id = this.getInt();
        let type = this.getByte();
        let openOnServerTimestamp = this.getLong();
        return new Chest(id, type, openOnServerTimestamp);
    },

    readCardTypeData: function (collection, i) {
        let type = this.getByte();
        // for (let i = 0; i < collection.length; i++) {
        //     if (collection[i].type === type) {
        //         return collection[i];
        //     }
        // }
        // return null;
        return collection.find(card => {
            return card.id === fake.deck[i].id;
        }); // fake data
    },
});

testnetwork.packetMap[gv.CMD.OPEN_CHEST] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },

        readData: function () {
            let status = this.getString();
            let chestID = this.getInt();
            let newCardsSize = this.getInt();
            cc.log('Received open chest response from server. Chest ID ' + chestID + ' with status \"' + status + '\" and the amount of new cards is ' + newCardsSize + '.');
            let newCards = [], goldReceived, serverNow;
            if (status === "Success") {
                for (let i = 0; i < newCardsSize; i++) {
                    newCards.push(this.readCardData());
                }
                goldReceived = this.getInt();
                serverNow = this.getLong();
                Utils.updateTimeDiff(serverNow);
                cc.director.getRunningScene().tabUIs[cf.LOBBY_TAB_HOME].openChestSlot(chestID, newCards, goldReceived);
            } else {
                Utils.addToastToRunningScene(status);
            }
        },

        readCardData: function () {
            let id = this.getInt();
            let name = this.getString();
            let type = this.getByte();
            let level = this.getInt();
            let quantity = this.getInt();
            let attackSpeed = this.getDouble();
            let attackRange = this.getDouble();
            return new MCard(id, name, type, level, quantity, attackSpeed, attackRange);
        },
    }
);



testnetwork.packetMap[gv.CMD.START_COOLDOWN] = fr.InPacket.extend({

    ctor: function () {
        this._super();
    },
    readData: function () {
        let chestID = this.getInt();
        let openOnServerTimestamp = this.getLong();
        cc.log('Received start cooldown response from server. Chest ID: ' + chestID + ', open on server timestamp: ' + openOnServerTimestamp + '.');

        let serverNow = this.getLong();
        Utils.updateTimeDiff(serverNow);

        if (openOnServerTimestamp === cf.UNOPEN_CHEST_TIMESTAMP ||
            openOnServerTimestamp === cf.UNOPEN_CHEST_TIMESTAMP.toString()) {
            Utils.addToastToRunningScene('Rương chưa được bắt đầu mở!');
            return;
        }
        if (chestID === -1 || chestID === '-1') {
            Utils.addToastToRunningScene('Server không tìm được chest hay user');
            return;
        }
        this.chest = sharePlayerInfo.getChestById(chestID);
        if (this.chest == null) {
            Utils.addToastToRunningScene('Client không tìm thấy rương');
            return;
        }

        cc.director.getRunningScene().tabUIs[cf.LOBBY_TAB_HOME].startCooldownChestSlot(chestID, openOnServerTimestamp);
    }
});

testnetwork.packetMap[gv.CMD.MOVE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.x = this.getInt();
            this.y = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.BATTLE_START] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            var scene = new cc.Scene();
            scene.addChild(new GameUI(this));
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
            cc.log('=================')
        }
    }
);
testnetwork.packetMap[gv.CMD.MATCH_REPONSE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.x = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.BATTLE_ACTIONS] = fr.InPacket.extend({
        ctor: function()
        {
            this._super();
        },

        readData: function(){
            const num = this.getInt()
            for (let i = 0; i < num; i++) {
                const size = this.getInt()
                const actionCode = this.getInt()
                ACTION_DESERIALIZER[actionCode](this).activate(GameStateManagerInstance)
            }
            GameStateManagerInstance.updateType = GameStateManagerInstance.UPDATE_TYPE_NORMAL
        }
    }
);
testnetwork.packetMap[gv.CMD.OFFER_RESPONSE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.status = this.getString()
            this.numChest = this.getInt()
            cc.log("OFFER_RESPONSE: "+ JSON.stringify(this))
            this.chestOffers = []
            for(var i=0; i<this.numChest; i++){
                var chestType = this.getByte(),
                chestCost = this.getInt()
                cc.log('chest:  '+chestType+' '+chestCost)
                this.chestOffers.push([chestType, chestCost])

            }
            this.numCard = this.getInt()
            this.cardOffers = []
            for(var i=0; i<this.numCard; i++){
                var cardType = this.getByte(),
                    cardCost = this.getInt()
                cc.log('card:  '+cardType+' '+cardCost)
                this.cardOffers.push([cardType, cardCost])
            }

            // this.numCard = this.getInt()
            // this.cardOffers = []
            // for(var i=0; i<this.numCard; i++){
            //     var chestType = this.getByte(),
            //         chestCost = this.getInt()
            //     this.cardOffers.push([chestType, chestCost])
            // }

            //
            // cc.log('aaaaaaaaaaaaaaaaaaaaaaa'+this.status+' '+this.numChest+' '+' '+this.chestType)
            // cc.log(this.chestCost)

        }
    }
);


testnetwork.packetMap[gv.CMD.BATTLE_SYNC_START] = fr.InPacket.extend({
        ctor: function()
        {
            this._super();
            this.syncN = 0
        },

        readData: function(){
            this.syncN = this.getLong()
        }
    }
);

testnetwork.packetMap[gv.CMD.BATTLE_SYNC_CLIENT_UPDATE_TO_FRAME_N] = fr.InPacket.extend({
        ctor: function()
        {
            this._super();
            this.syncN = 0
            this.frameN = 0
        },

        readData: function(){
            cc.log("============================recv BATTLE_SYNC_CLIENT_UPDATE_TO_FRAME_N============================================")
            this.syncN = this.getLong()
            this.frameN = this.getLong()
        }
    }
);

