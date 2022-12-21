const NextWaveAction = cc.Class.extend({
    // ctor: function (N, monstersId) {
    //     this.N = N
    //
    //     if (monstersId) {
    //         this.monstersId = monstersId
    //     } else {
    //         this.monstersId = null
    //     }
    // },

    ctor: function (N, monstersIdA, monstersIdB, userIdA, userIdB) {
        this.N = N

        this.monstersIdA = monstersIdA
        this.monstersIdB = monstersIdB
        this.userIdA = userIdA
        this.userIdB = userIdB
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
            GameStateManagerInstance._timer.resetTime(GAME_CONFIG.TIME_WAVE)
            GameStateManagerInstance._timer.checkSendNewWaveOnce = false
            GameUI.instance.activateNextWaveForBoth(this.monstersIdA, this.monstersIdB, this.userIdA, this.userIdB)
            gameStateManager.waveCount++
        }
    }
})

NextWaveAction.deserializer = function (pkg) {
    let tmp = []
    const N = pkg.getInt()
    tmp.push(N)

    const numA = pkg.getInt()
    tmp.push(numA)
    for (let i = 0; i < numA; i++) {
        tmp.push(pkg.getInt())
    }

    const numB = pkg.getInt()
    tmp.push(numB)
    for (let i = 0; i < numB; i++) {
        tmp.push(pkg.getInt())
    }

    tmp.push(pkg.getInt())
    tmp.push(pkg.getInt())

    return tmp
}

NextWaveAction.deserializerArr = function (arrPkg) {
    let c = 0
    const N = arrPkg[c++]

    const numA = arrPkg[c++]
    const monstersIdA = []
    for (let i = 0; i < numA; i++) {
        monstersIdA.push(arrPkg[c++])
    }

    const numB = arrPkg[c++]
    const monstersIdB = []
    for (let i = 0; i < numB; i++) {
        monstersIdB.push(arrPkg[c++])
    }

    const userIdA = arrPkg[c++]
    const userIdB = arrPkg[c++]
    return new NextWaveAction(N, monstersIdA, monstersIdB, userIdA, userIdB)
}