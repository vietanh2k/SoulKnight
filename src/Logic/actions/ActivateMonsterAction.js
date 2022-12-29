const ActivateMonsterAction = cc.Class.extend({
    ctor: function (monsterID, uid) {

        this.monsterID = monsterID
        this.uid = uid
    },

    writeTo: function (pkg) {
        pkg.putByte(this.monsterID)
        pkg.putInt(this.uid)
        cc.log("ActivateCardAction " + this.uid)
    },

    getActionCode: function () {
        return ACTION_CODE.ACTIVATE_MONSTER_ACTION
    },

    getActionDataSize: function () {
        return 1+4;
    },

    activate: function (gameStateManager) {
        cc.log(' Client tha quai tai frame = '+ GameStateManagerInstance.frameCount)
        GameUI.instance.activateCardMonster(this.monsterID, this.uid);
    }
})

ActivateMonsterAction.deserializer = function (pkg) {
    let tmp = []
    const monsterID = pkg.getByte(), uid = pkg.getInt();

    tmp.push(monsterID)
    tmp.push(uid)
    return tmp
}

ActivateMonsterAction.deserializerArr = function (pkgArr) {
    const monsterID = pkgArr[0], uid = pkgArr[1];
    return new ActivateMonsterAction(monsterID, uid);
}