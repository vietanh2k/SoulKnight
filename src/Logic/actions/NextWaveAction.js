const NextWaveAction = cc.Class.extend({
    ctor: function (N, monstersId) {
        this.N = N

        if (monstersId) {
            this.monstersId = monstersId
        } else {
            this.monstersId = null
        }
    },

    writeTo: function (pkg) {
        pkg.putInt(this.N)
        pkg.putInt(0)
        cc.log("NextWaveAction")
    },

    getActionCode: function () {
        return ACTION_CODE.NEXT_WAVE_ACTION
    },

    getActionDataSize: function () {
        return 4 + 4;
    },

    activate: function (gameStateManager) {
        if (gameStateManager.waveCount === this.N) {
            //GameUI.instance.addMonsterToBoth()

            GameUI.instance.activateNextWave(this.monstersId)
            gameStateManager.waveCount++
        }
    }
})

NextWaveAction.deserializer = function (pkg) {
    let tmp = []
    const N = pkg.getInt()
    const num = pkg.getInt()
    tmp.push(N)
    tmp.push(num)
    cc.log("======================= Wave monster count: " + num)

    const monstersId = []
    for (let i = 0; i < num; i++) {
        var tmp2 = pkg.getInt()
        // monstersId.push(tmp2)
        tmp.push(tmp2)
    }
    // var dst = new ArrayBuffer(this.byteLength);


    return tmp
}

NextWaveAction.deserializerArr = function (arrPkg) {
    const N = arrPkg[0]
    const num = arrPkg[1]

    cc.log("======================= Wave monster count: " + num)

    const monstersId = []
    for (let i = 0; i < num; i++) {
        monstersId.push(arrPkg[2+i])
    }

    return new NextWaveAction(N, monstersId)
}