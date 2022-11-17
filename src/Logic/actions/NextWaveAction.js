const NextWaveAction = cc.Class.extend({
    ctor: function (N) {
        this.N = N
    },

    writeTo: function (pkg) {
        pkg.putInt(this.N)
        cc.log("NextWaveAction")
    },

    getActionCode: function () {
        return ACTION_CODE.NEXT_WAVE_ACTION
    },

    getActionDataSize: function () {
        return 4;
    },

    activate: function (gameStateManager) {
        if (gameStateManager.waveCount === this.N) {
            GameUI.instance.addMonsterToBoth()
            gameStateManager.waveCount++
        }
    }
})

NextWaveAction.deserializer = function (pkg) {
    const N = pkg.getInt()
    return new NextWaveAction(N)
}