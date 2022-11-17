const ActivateCardAction = cc.Class.extend({
    ctor: function (id, x, y) {
        this.id = id
        this.x = x
        this.y = y
    },

    writeTo: function (pkg) {
        pkg.putInt(this.id)
        pkg.putInt(this.x)
        pkg.putInt(this.y)
    },

    getActionCode: function () {
        return ACTION_CODE.ACTIVATE_CARD_ACTION
    },

    getActionDataSize: function () {
        return 3 * 4;
    },

    activate: function (gameStateManager) {

    }
})

ActivateCardAction.deserializer = function (pkg) {
    return new ActivateCardAction(pkg.getInt(), new Vec2(pkg.getInt(), pkg.getInt()))
}