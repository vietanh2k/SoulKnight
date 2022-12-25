const ActivateSpellAction = cc.Class.extend({
    ctor: function (card_type, x,y, uid, mapCast) {
        this.card_type = card_type
        this.x = x
        this.y = y
        this.uid = uid
        this.mapCast = mapCast
    },

    writeTo: function (pkg) {
        pkg.putByte(this.card_type)
        pkg.putInt(this.x)
        pkg.putInt(this.y)
        pkg.putInt(this.uid)
        pkg.putInt(this.mapCast)
        cc.log("ActivateCardAction " + this.uid)
    },

    getActionCode: function () {
        return ACTION_CODE.ACTIVATE_SPELL_ACTION;
    },

    getActionDataSize: function () {
        return 1+4+4+4+4;
    },

    activate: function (gameStateManager) {
        let date = Date.now();
        GameUI.instance.activateCardPotion(this.card_type, new Vec2(this.x, this.y), this.uid, this.mapCast);

        cc.log("=>>>>> time function spell = "+(Date.now() - date))
    }
})

ActivateSpellAction.deserializer = function (pkg) {
    let tmp = []
    const card_type = pkg.getByte(), x = pkg.getInt(), y = pkg.getInt(), uid = pkg.getInt(), mapCast = pkg.getInt();
    if (uid != gv.gameClient._userId ){
        let otherMap;
        if(mapCast == 1){
            otherMap = 2;
        }else {
            otherMap = 1;
        }
        let posUI = convertPosLogicToPosUI(new Vec2(x,y), otherMap);
        GameUI.instance.addSpellUIBeforeExplose(card_type, posUI);
    }
    tmp.push(card_type)
    tmp.push(x)
    tmp.push(y)
    tmp.push(uid)
    tmp.push(mapCast)
    cc.log('nhan dc a='+a)
    return tmp
}

ActivateSpellAction.deserializerArr = function (pkgArr) {
    const card_type = pkgArr[0], x = pkgArr[1], y = pkgArr[2], uid = pkgArr[3], mapCast = pkgArr[4];
    return new ActivateSpellAction(card_type, x, y, uid, mapCast);
}