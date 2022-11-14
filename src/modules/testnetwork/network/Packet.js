/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD ||{};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.MOVE = 2001;
gv.CMD.OPEN_CHEST_NOW = 3001;
gv.CMD.START_COOL_DOWN = 3002;
gv.CMD.UPDATE_PLAYER_INFO = 3003;
gv.CMD.MATCH_REQUEST = 4001;
gv.CMD.MATCH_REPONSE = 4002;
gv.CMD.MATCH_CONFIRM = 4003;
gv.CMD.BATTLE_START = 5001;

testnetwork = testnetwork||{};
testnetwork.packetMap = {};


/** Outpacket */

//Handshake
CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
            this.setCmdId(gv.CMD.HAND_SHAKE);
        },
        putData:function(){
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
)
CmdSendUserInfo = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_INFO);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendOpenChest = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.OPEN_CHEST_NOW);
        },
        /**
         * send open chest request
         * sử dụng biến sharePlayerInfo.id
         * @param {Chest} chest: the chest to open*/
        putData:function(chest){
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
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.START_COOL_DOWN);
        },
        /**
         * send open START COOL DOWN request
         * sử dụng biến sharePlayerInfo.id
         * @param {Chest} chest: the chest to START OPENING*/
        putData:function(chest){
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
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_LOGIN);
        },
        pack:function(userId){
            this.packHeader();
            this.putString("section");
            this.putInt(userId)
            this.updateSize();
        }
    }
)

CmdSendMove = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MOVE);
        },
        pack:function(direction){
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


/**
 * InPacket
 */

//Handshake
testnetwork.packetMap[gv.CMD.HAND_SHAKE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.token = this.getString();
        }
    }
);

testnetwork.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
        }
    }
);


testnetwork.packetMap[gv.CMD.USER_INFO] = fr.InPacket.extend(
    {
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
            for (let i = 0; i < collectionSize; i++) {
                collection.push(new Card(this));
            }
            let chestListSize = this.getInt();
            let chestList = [];
            for (let i = 0; i < chestListSize; i++) {
                chestList.push(new Chest(this));
            }
            let deckSize = this.getInt();
            let deck = [];
            for (let i = 0; i < deckSize; i++) {
                deck.push(new Card(this));
            }
            sharePlayerInfo = new PlayerInfo(id, name, gold, gem, trophy, collection, chestList, deck);
            cc.log("Loaded user info: " + JSON.stringify(sharePlayerInfo));
        }
    }
);

testnetwork.packetMap[gv.CMD.OPEN_CHEST_NOW] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.status = this.getString();
            this.player_info_is_not_null = this.getBool();
            if (this.player_info_is_not_null) {
                sharePlayerInfo = new PlayerInfo(this);
            }
        }
    }
);


testnetwork.packetMap[gv.CMD.START_COOL_DOWN] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            // this.status = this.getString();
            var chestID = this.getInt();

            this.chest = sharePlayerInfo.getChestById(chestID);
            if (this.chest != null) {
                this.chest.onStartCoolDown(this);
            }
            // if(this.player_info_is_not_null)  sharePlayerInfo = new PlayerInfo(this);

        }
    }
);


testnetwork.packetMap[gv.CMD.MOVE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
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






