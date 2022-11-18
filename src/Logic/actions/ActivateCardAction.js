const ActivateCardAction = cc.Class.extend({
    ctor: function (card_type, x,y) {
        this.card_type = card_type
        this.x = x
        this.y = y
    },

    writeTo: function (pkg) {
        pkg.putByte(this.card_type)
        pkg.putInt(this.x)
        pkg.putInt(this.y)
        cc.log("ActivateCardAction")
    },

    getActionCode: function () {
        return ACTION_CODE.ACTIVATE_CARD_ACTION
    },

    getActionPkgSize: function () {
        return 1+4+4;
    },

    activate: function (gameStateManager) {
        GameUI.instance.activateCard(this.card_type, new Vec2(this.x, this.y));
        // if (gameStateManager.waveCount === this.N) {
        //     GameUI.instance.addMonsterToBoth()
        //     gameStateManager.waveCount++
        // }
    }
})

ActivateCardAction.deserializer = function (pkg) {
    const card_type = pkg.getByte(), x = pkg.getInt(), y = pkg.getInt();
    return new ActivateCardAction(card_type, x, y);
}