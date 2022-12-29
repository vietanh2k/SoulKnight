const ActivateMonsterAction = cc.Class.extend({
    ctor: function (typeCard, monsterID, uid) {
        this.typeCard = typeCard;
        this.monsterID = monsterID;
        this.uid = uid;
    },

    writeTo: function (pkg) {
        pkg.putByte(this.typeCard)
        pkg.putByte(this.monsterID)
        pkg.putInt(this.uid)
        cc.log("ActivateCardAction " + this.uid)
    },

    getActionCode: function () {
        return ACTION_CODE.ACTIVATE_MONSTER_ACTION
    },

    getActionDataSize: function () {
        return 1+4+4;
    },

    activate: function (gameStateManager) {
        cc.log(' Client tha quai tai frame = '+ GameStateManagerInstance.frameCount)
        GameUI.instance.activateCardMonster(this.typeCard, this.monsterID, this.uid);
    }
})

ActivateMonsterAction.deserializer = function (pkg) {
    let tmp = []
    const typeCard = pkg.getByte(), monsterID = pkg.getByte(), uid = pkg.getInt();
    tmp.push(typeCard)
    tmp.push(monsterID)
    tmp.push(uid)
    return tmp
}

ActivateMonsterAction.deserializerArr = function (pkgArr) {
    const typeCard = pkgArr[0], monsterID = pkgArr[1], uid = pkgArr[2];
    return new ActivateMonsterAction(typeCard, monsterID, uid);
}