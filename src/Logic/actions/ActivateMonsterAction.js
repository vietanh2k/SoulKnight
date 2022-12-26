const ActivateMonsterAction = cc.Class.extend({
    ctor: function (card_type, uid) {
        cc.log(' Client an dat tru tai frame = '+ GameStateManagerInstance.frameCount)
        this.card_type = card_type
        this.uid = uid
    },

    writeTo: function (pkg) {
        pkg.putByte(this.card_type)
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
        GameUI.instance.activateCardMonster(this.card_type, this.uid);
    }
})

ActivateMonsterAction.deserializer = function (pkg) {
    let tmp = []
    const card_type = pkg.getByte(), uid = pkg.getInt();

    tmp.push(card_type)
    tmp.push(uid)
    return tmp
}

ActivateMonsterAction.deserializerArr = function (pkgArr) {
    const card_type = pkgArr[0], uid = pkgArr[1];
    return new ActivateMonsterAction(card_type, uid);
}