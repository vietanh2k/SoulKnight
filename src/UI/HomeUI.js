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
        // this.addAtlasEndBattle()
        // this.addAtlasEndBattle2()

        this.schedule(this.updateChestTimers, 1);
    },
    addAtlasEndBattle: function (resultString) {

        let resultAnimation = new sp.SkeletonAnimation("res/potion/effect_atk_fire.json",
            "res/potion/effect_atk_fire.atlas")
        resultAnimation.setPosition(winSize.width / 3*2, winSize.height / 2 + CELLWIDTH * 0.2)
        // resultAnimation.setAnimation(0, "animation_fireball", true)

        let initSequence = cc.sequence(
            cc.callFunc(() => resultAnimation.setAnimation(0, "animation_fireball", true)),
            cc.delayTime(2),
            cc.callFunc(() => {
                resultAnimation.setAnimation(0, "animation_full", false);
            }),
            cc.delayTime(2.5)
        ).repeatForever();
        this.runAction(initSequence)
        // resultAnimation.runAction(seq)
        // resultAnimation.runAction(seq2)
        this.addChild(resultAnimation, 4001)
    },

    addAtlasEndBattle2: function (resultString) {

        let resultAnimation = new sp.SkeletonAnimation("res/potion/effect_atk_ice.json",
            "res/potion/effect_atk_ice.atlas")
        resultAnimation.setPosition(winSize.width / 3, winSize.height / 2 + CELLWIDTH * 0.2)
        // resultAnimation.setAnimation(0, "animation_fireball", true)

        let initSequence = cc.sequence(
            // cc.callFunc(() => resultAnimation.setAnimation(0, "animation_ice_ball", true)),
            cc.delayTime(2),
            cc.callFunc(() => {
                resultAnimation.setAnimation(0, "animation_full", true);
            }),
            cc.delayTime(3),
            cc.callFunc(() => {
                resultAnimation.removeFromParent(true);
            })
        );
        this.runAction(initSequence)
        // resultAnimation.runAction(seq)
        // resultAnimation.runAction(seq2)
        this.addChild(resultAnimation, 4001)
    },

    initLobbyHomePlayer: function () {
        this.lobbyHomePlayer = new cc.Sprite(asset.lobbyHomePlayer_png);
        this.lobbyHomePlayer.attr({
            anchorX: 0,
            anchorY: 1,
            x: 0,
            y: cf.HEIGHT - cf.WIDTH / 854 * 85,
            scale: cf.WIDTH / this.lobbyHomePlayer.width,
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

        this.lbPlayerTrophy = new ccui.Text(Utils.toStringWithDots(sharePlayerInfo.trophy), asset.svnSupercellMagic_ttf, 22);
        this.lbPlayerTrophy.attr({
            anchorX: 0,
            x: this.lobbyHomePlayer.width * 0.97 - this.trophyBox.width,
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
        this.arenaGlow = new cc.Sprite(asset.arenaGlow_png);
        this.arenaGlow.attr({
            anchorY: 0,
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4,
            scale: cf.WIDTH * 0.9 / this.arenaGlow.width,
        });
        this.addChild(this.arenaGlow);

        this.arena = new cc.Sprite(asset.commonArenaForest_png);
        this.arena.attr({
            anchorY: 0,
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.5,
            scale: cf.WIDTH * 0.45 / this.arena.width,
        });
        this.addChild(this.arena);

        this.lbArena = new ccui.Text('ĐỒI NGỦ YÊN', asset.svnSupercellMagic_ttf, 60);
        this.lbArena.attr({
            anchorY: 0,
            x: this.arena.width / 2,
        });
        this.lbPlayerTrophy.enableShadow();
        this.arena.addChild(this.lbArena);

        this.arenaParticle = new cc.ParticleSystem(asset.arenaParticle_plist);
        this.arenaParticle.attr({
            x: cf.WIDTH / 2,
            y: this.arena.y + this.arena.height * this.arena.scale / 2,
            scale: 2,
        });
        this.addChild(this.arenaParticle);

        this.btnBattle = new ccui.Button(asset.btnBattle_png, asset.btnBattlePressing_png, asset.btnBattle_png);
        this.btnBattle.attr({
            anchorY: 1,
            x: this.arena.width / 2,
            y: -10,
            scale: this.arena.width * 0.9 / this.btnBattle.width,
        });
        this.btnBattle.setSwallowTouches(false);
        this.btnBattle.addClickEventListener(() => {
            if (this.parent.allBtnIsActive && !this.parent.isChangingTabAfterHorizontalScroll()) {
                // // hiện tại đang dùng nút này để debug
                // Utils.addToastToRunningScene('Opening chest counter: ' + this.openingChestCounter);
                // cc.log("User data: " + JSON.stringify(sharePlayerInfo));

                let fullChestSlots = true;
                for (let i = 0; i < this.chestSlots.length; i++) {
                    if (this.chestSlots[i].constructor.name === 'Sprite') {
                        fullChestSlots = false;
                    }
                }
                if (fullChestSlots) {
                    Utils.addToastToRunningScene('Số lượng rương đã đạt tối đa!');
                }
                fr.view(MatchingUI)
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
        let emptySlots = [0, 1, 2, 3];
        for (let i = 0; i < sharePlayerInfo.chestList.length; i++) {
            let chest = sharePlayerInfo.chestList[i];
            this.chestSlots[chest.id] = new ChestSlot(chest, chest.id);
            if (this.chestSlots[chest.id].textTime !== undefined && this.chestSlots[chest.id].textOpenCost !== undefined) {
                this.openingChestCounter++;
            }
            this.addChestSlotAsChild(chest.id);

            const index = emptySlots.indexOf(chest.id);
            if (index > -1) emptySlots.splice(index, 1);
        }

        emptySlots.forEach(emptySlot => {
            this.chestSlots[emptySlot] = new cc.Sprite(asset.treasureEmpty_png);
            let textStatus = new ccui.Text('Ô Trống', asset.svnSupercellMagic_ttf, 18);
            textStatus.attr({
                x: this.chestSlots[emptySlot].width / 2,
                y: this.chestSlots[emptySlot].height / 2,
                color: cc.color(161, 180, 184),
            });
            textStatus.enableShadow();
            this.chestSlots[emptySlot].addChild(textStatus, 0);
            this.addChestSlotAsChild(emptySlot);
        });
    },

    updateChestTimers: function () {
        for (let i = 0; i < sharePlayerInfo.chestList.length; i++) {
            let chest = sharePlayerInfo.chestList[i];
            if (chest === undefined || chest.openTimeStarted === null) {
                continue;
            }
            if (this.chestSlots[chest.id].textTime !== undefined && this.chestSlots[chest.id].textOpenCost !== undefined) {
                let openTimeLeft = Utils.getOpenTimeLeft(chest);
                if (openTimeLeft > 0) {
                    this.chestSlots[chest.id].textTime.setString(Utils.milisecondsToReadableTime(openTimeLeft));
                    this.chestSlots[chest.id].textOpenCost.setString(Utils.gemCostToOpenChest(openTimeLeft).toString());
                } else {
                    this.removeChild(this.chestSlots[chest.id], true);
                    this.openingChestCounter--;
                    this.chestSlots[chest.id] = new ChestSlot(chest, chest.id);
                    this.addChestSlotAsChild(chest.id);
                }
            }
        }
    },

    addChestSlotAsChild: function (slot) {
        let slotWidth = cf.WIDTH / (cf.LOBBY_MAX_CHEST + 0.5);
        let spaceBetween = slotWidth / 2 / (cf.LOBBY_MAX_CHEST + 1);
        let chestX = spaceBetween * (slot + 1) + slotWidth * (slot + 0.5);
        let chestY = cf.HEIGHT / 4;
        this.chestSlots[slot].attr({
            x: chestX,
            y: chestY,
            scale: slotWidth / this.chestSlots[slot].width,
        });
        this.addChild(this.chestSlots[slot]);
    },

    sendRequestStartCooldownChestSlot: function (slot) {
        let chest = this.chestSlots[slot].chest;
        testnetwork.connector.sendStartCooldownRequest(chest);
    },

    startCooldownChestSlot: function (chestID, openOnServerTimestamp) {
        let chest = this.chestSlots[chestID].chest;
        chest.updateWhenStartToOpen(openOnServerTimestamp);
        this.removeChild(this.chestSlots[chestID], true);

        this.openingChestCounter++;
        this.chestSlots[chestID] = new ChestSlot(chest, chestID);
        this.addChestSlotAsChild(chestID);
    },

    sendRequestOpenChestSlot: function (slot) {
        let chest = this.chestSlots[slot].chest;
        let gemSpent = Utils.gemCostToOpenChest(Utils.getOpenTimeLeft(chest));
        chest.waitingOpenChestResponseWithGems = gemSpent;
        testnetwork.connector.sendOpenChestRequest(chest, gemSpent);
    },

    openChestSlot: function (chestID, newCards, goldReceived) {
        let chest = this.chestSlots[chestID].chest;
        if (chest.waitingOpenChestResponseWithGems == null) {
            return;
        }

        if (Utils.isOpening(chest)) {
            this.openingChestCounter--;
        }

        sharePlayerInfo.addNewCards(newCards);
        sharePlayerInfo.gem -= chest.waitingOpenChestResponseWithGems;
        sharePlayerInfo.gold += goldReceived;
        sharePlayerInfo.removeChest(chestID);

        this.parent.currencyPanel.updateLabels();

        this.removeChild(this.chestSlots[chestID], true);

        this.chestSlots[chestID] = new cc.Sprite(asset.treasureEmpty_png);
        let textStatus = new ccui.Text('Ô Trống', asset.svnSupercellMagic_ttf, 18);
        textStatus.attr({
            x: this.chestSlots[chestID].width / 2,
            y: this.chestSlots[chestID].height / 2,
            color: cc.color(161, 180, 184),
        });
        textStatus.enableShadow();
        this.chestSlots[chestID].addChild(textStatus, 0);
        this.addChestSlotAsChild(chestID);
    },
});
