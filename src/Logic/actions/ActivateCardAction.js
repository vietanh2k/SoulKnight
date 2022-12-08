const ActivateCardAction = cc.Class.extend({
    ctor: function (card_type, x,y, uid) {
        this.card_type = card_type
        this.x = x
        this.y = y
        this.uid = uid
    },

    writeTo: function (pkg) {
        pkg.putByte(this.card_type)
        pkg.putInt(this.x)
        pkg.putInt(this.y)
        pkg.putInt(this.uid)
        cc.log("ActivateCardAction " + this.uid)
    },

    getActionCode: function () {
        return ACTION_CODE.ACTIVATE_CARD_ACTION
    },

    getActionDataSize: function () {
        return 1+4+4+4;
    },

    activate: function (gameStateManager) {
        GameUI.instance.activateCard(this.card_type, new Vec2(this.x, this.y), this.uid);
    }
})

ActivateCardAction.deserializer = function (pkg) {
    let tmp = []
    const card_type = pkg.getByte(), x = pkg.getInt(), y = pkg.getInt(), uid = pkg.getInt();
    tmp.push(card_type)
    tmp.push(x)
    tmp.push(y)
    tmp.push(uid)
    return tmp
}

ActivateCardAction.deserializerArr = function (pkgArr) {
    const card_type = pkgArr[0], x = pkgArr[1], y = pkgArr[2], uid = pkgArr[3];
    return new ActivateCardAction(card_type, x, y, uid);
}