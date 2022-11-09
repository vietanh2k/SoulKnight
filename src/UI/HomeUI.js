// this.parent: LobbyScene
var HomeUI = cc.Layer.extend({
    lobbyHomePlayer: null,
    avatarBorder: null,
    avatar: null,
    lbPlayerName: null,
    trophyBox: null,
    iconTrophy: null,
    lbPlayerTrophy: null,
    arena: null,
    lbArena: null,
    btnBattle: null,
    btnBattleText: null,
    chestSlots: null,
    openingChestCounter: 0,

    ctor: function () {
        this._super();

        this.initLobbyHomePlayer();
        this.initLobbyArena();
        this.initChestSlots();

        this.schedule(this.updateChests, 1);
    },

    initLobbyHomePlayer: function () {
        this.lobbyHomePlayer = new cc.Sprite(asset.lobbyHomePlayer_png);
        this.lobbyHomePlayer.attr({
            anchorX: 0,
            anchorY: 1,
            x: 0,
            y: CFG.HEIGHT - CFG.WIDTH / 854 * 85,
            scale: CFG.WIDTH / this.lobbyHomePlayer.width,
        });
        this.addChild(this.lobbyHomePlayer);

        this.avatar = new cc.Sprite(asset.avatar_png);
        this.avatar.attr({
            x: this.lobbyHomePlayer.height * 0.35,
            y: this.lobbyHomePlayer.height * 0.55,
            scale: this.lobbyHomePlayer.height * 0.45 / this.avatar.height,
        });
        this.lobbyHomePlayer.addChild(this.avatar);

        this.avatarBorder = new cc.Sprite(asset.avatarBorder_png);
        this.avatarBorder.attr({
            x: this.lobbyHomePlayer.height * 0.35,
            y: this.lobbyHomePlayer.height * 0.55,
            scale: this.lobbyHomePlayer.height * 0.5 / this.avatarBorder.height,
        });
        this.lobbyHomePlayer.addChild(this.avatarBorder);

        this.lbPlayerName = new ccui.Text(sharePlayerInfo.name, asset.svnSupercellMagic_ttf, 20);
        this.lbPlayerName.attr({
            anchorX: 0,
            x: this.lobbyHomePlayer.height * 0.65,
            y: this.lobbyHomePlayer.height * 0.6,
            color: cc.color(253, 254, 218),
        });
        this.lbPlayerName.enableShadow();
        this.lobbyHomePlayer.addChild(this.lbPlayerName);

        this.trophyBox = new cc.Sprite(asset.lobbyBox_png);
        this.trophyBox.attr({
            anchorX: 1,
            x: this.lobbyHomePlayer.width * 0.95,
            y: this.lobbyHomePlayer.height * 0.6,
            scale: this.lobbyHomePlayer.height * 0.4 / this.trophyBox.height,
        });
        this.lobbyHomePlayer.addChild(this.trophyBox);

        this.iconTrophy = new cc.Sprite(asset.iconTrophy_png);
        this.iconTrophy.attr({
            x: this.trophyBox.x - this.trophyBox.width * this.trophyBox.scale,
            y: this.lobbyHomePlayer.height * 0.6,
            scale: this.lobbyHomePlayer.height * 0.5 / this.iconTrophy.height,
        });
        this.lobbyHomePlayer.addChild(this.iconTrophy);

        this.lbPlayerTrophy = new ccui.Text(Utils.toStringWithDots(FAKE.trophy), asset.svnSupercellMagic_ttf, 22);
        this.lbPlayerTrophy.attr({
            anchorX: 0,
            x: this.lobbyHomePlayer.width * 0.95 - this.trophyBox.width,
            y: this.lobbyHomePlayer.height * 0.6,
            color: cc.color(249, 216, 70),
            scale: Math.min(
                this.trophyBox.height * 0.8 / this.lbPlayerTrophy.height,
                        this.trophyBox.width * 0.9 / this.lbPlayerTrophy.width
            ),
        });
        this.lbPlayerTrophy.enableShadow();
        this.lobbyHomePlayer.addChild(this.lbPlayerTrophy);
    },

    initLobbyArena: function () {
        this.arena = new cc.Sprite(asset.commonArenaForest_png);
        this.arena.attr({
            anchorY: 0,
            x: CFG.WIDTH / 2,
            y: CFG.HEIGHT * 0.5,
            scale: CFG.WIDTH * 0.45 / this.arena.width,
        });
        this.addChild(this.arena);

        this.lbArena = new ccui.Text('ĐỒI NGỦ YÊN', asset.svnSupercellMagic_ttf, 60);
        this.lbArena.attr({
            anchorY: 0,
            x: this.arena.width / 2,
        });
        this.lbPlayerTrophy.enableShadow();
        this.arena.addChild(this.lbArena);

        this.btnBattle = new ccui.Button(asset.btnBattle_png, asset.btnBattlePressing_png, asset.btnBattle_png);
        this.btnBattle.attr({
            anchorY: 1,
            x: this.arena.width / 2,
            y: -10,
            scale: this.arena.width * 0.9 / this.btnBattle.width,
        });
        this.btnBattle.addClickEventListener(() => {
            // TODO remove next line
            cc.log('opening chest counter: ' + this.openingChestCounter);
            if (this.parent.allBtnIsActive) {
                for (let i = 0; i < this.chestSlots.length; i++) {
                    if (this.chestSlots[i].constructor.name === 'Sprite') {
                        return;
                    }
                }
                this.addChild(new Toast('Số lượng rương đã đạt tối đa!'));
            }
        });
        this.arena.addChild(this.btnBattle);

        this.btnBattleText = new cc.Sprite(asset.btnBattleTxt_png);
        this.btnBattleText.attr({
            anchorY: 1,
            x: this.btnBattle.width / 2,
            y: this.btnBattle.height * 0.85,
            scale: this.btnBattle.width * 0.7 / this.btnBattleText.width,
        });
        this.btnBattle.addChild(this.btnBattleText);
    },

    initChestSlots: function () {
        this.chestSlots = [];
        for (let i = 0; i < CFG.LOBBY_MAX_CHEST; i++) {
            let chest = FAKE.chests[i];
            let slotWidth = CFG.WIDTH / (CFG.LOBBY_MAX_CHEST + 0.5);
            let spaceBetween = slotWidth / 2 / (CFG.LOBBY_MAX_CHEST + 1);
            let chestX = spaceBetween * (i + 1) + slotWidth * (i + 0.5);
            let chestY = CFG.HEIGHT / 4;
            if (chest === undefined) {
                this.chestSlots[i] = new cc.Sprite(asset.treasureEmpty_png);
                let textStatus = new ccui.Text('Ô Trống', asset.svnSupercellMagic_ttf, 18);
                textStatus.attr({
                    x: this.chestSlots[i].width / 2,
                    y: this.chestSlots[i].height / 2,
                    color: cc.color(161, 180, 184),
                });
                textStatus.enableShadow();
                this.chestSlots[i].addChild(textStatus, 0);
            } else {
                this.chestSlots[i] = new ChestSlot(chest, i);
                if (this.chestSlots[i].textTime !== undefined && this.chestSlots[i].textOpenCost !== undefined) {
                    this.openingChestCounter++;
                }
            }
            this.chestSlots[i].attr({
                x: chestX,
                y: chestY,
                scale: slotWidth / this.chestSlots[i].width,
            });
            this.addChild(this.chestSlots[i]);
        }
    },

    updateChests: function () {
        for (let i = 0; i < this.chestSlots.length; i++) {
            let chest = FAKE.chests[i];
            if (chest === undefined || chest.openTimeStarted === null) {
                continue;
            }
            if (this.chestSlots[i].textTime !== undefined && this.chestSlots[i].textOpenCost !== undefined) {
                let openTimeLeft = Utils.getOpenTimeLeft(chest);
                if (openTimeLeft > 0) {
                    this.chestSlots[i].textTime.setString(Utils.milisecondsToReadableTime(openTimeLeft));
                    this.chestSlots[i].textOpenCost.setString(Utils.gemCostToOpenChest(openTimeLeft).toString());
                } else {
                    this.removeChild(this.chestSlots[i], true);
                    this.openingChestCounter--;
                    this.chestSlots[i] = new ChestSlot(chest, i);
                    let slotWidth = CFG.WIDTH / (CFG.LOBBY_MAX_CHEST + 0.5);
                    let spaceBetween = slotWidth / 2 / (CFG.LOBBY_MAX_CHEST + 1);
                    let chestX = spaceBetween * (i + 1) + slotWidth * (i + 0.5);
                    let chestY = CFG.HEIGHT / 4;
                    this.chestSlots[i].attr({
                        x: chestX,
                        y: chestY,
                        scale: slotWidth / this.chestSlots[i].width,
                    });
                    this.addChild(this.chestSlots[i]);
                }
            }
        }
    },

    openChestSlot: function (slot) {
        let chest = FAKE.chests[slot];
        chest.openTimeStarted = Date.now();
        this.removeChild(this.chestSlots[slot], true);
        this.openingChestCounter++;
        this.chestSlots[slot] = new ChestSlot(chest, slot);
        let slotWidth = CFG.WIDTH / (CFG.LOBBY_MAX_CHEST + 0.5);
        let spaceBetween = slotWidth / 2 / (CFG.LOBBY_MAX_CHEST + 1);
        let chestX = spaceBetween * (slot + 1) + slotWidth * (slot + 0.5);
        let chestY = CFG.HEIGHT / 4;
        this.chestSlots[slot].attr({
            x: chestX,
            y: chestY,
            scale: slotWidth / this.chestSlots[slot].width,
        });
        this.addChild(this.chestSlots[slot]);
    },

    consumeChestSlot: function (slot) {
        // TODO nhận được tài nguyên sau khi mở rương
        let chest = FAKE.chests[slot];
        if (Utils.isOpening(chest)) {
            this.openingChestCounter--;
        }
        sharePlayerInfo.gem -= Utils.gemCostToOpenChest(Utils.getOpenTimeLeft(chest));
        this.parent.currencyPanel.updateLabels();
        this.removeChild(this.chestSlots[slot], true);
        this.chestSlots[slot] = new cc.Sprite(asset.treasureEmpty_png);
        let textStatus = new ccui.Text('Ô Trống', asset.svnSupercellMagic_ttf, 18);
        textStatus.attr({
            x: this.chestSlots[slot].width / 2,
            y: this.chestSlots[slot].height / 2,
            color: cc.color(161, 180, 184),
        });
        textStatus.enableShadow();
        this.chestSlots[slot].addChild(textStatus, 0);

        let slotWidth = CFG.WIDTH / (CFG.LOBBY_MAX_CHEST + 0.5);
        let spaceBetween = slotWidth / 2 / (CFG.LOBBY_MAX_CHEST + 1);
        let chestX = spaceBetween * (slot + 1) + slotWidth * (slot + 0.5);
        let chestY = CFG.HEIGHT / 4;
        this.chestSlots[slot].attr({
            x: chestX,
            y: chestY,
            scale: slotWidth / this.chestSlots[slot].width,
        });
        this.addChild(this.chestSlots[slot]);
    },
});
