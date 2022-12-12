const ChangePrioritizedTargetAction = cc.Class.extend({
    ctor: function (prioritizedTarget, x, y, uid) {
        this.prioritizedTarget = prioritizedTarget;
        this.x = x;
        this.y = y;
        this.uid = uid;
    },

    writeTo: function (pkg) {
        pkg.putByte(this.prioritizedTarget);
        pkg.putInt(this.x);
        pkg.putInt(this.y);
        pkg.putInt(this.uid);
        cc.log("ChangePrioritizedTargetAction " + this.uid);
    },

    getActionCode: function () {
        return ACTION_CODE.CHANGE_PRIORITIZED_TARGET_ACTION;
    },

    getActionDataSize: function () {
        return 1 + 4 + 4 + 4;
    },

    activate: function (gameStateManager) {
        if (this.uid === gv.gameClient._userId ) {
            let tower = GameStateManagerInstance.playerA.getMap().getTowerAtPosition(new cc.p(this.x, this.y));
            if (tower === undefined) {
                return false;
            }
            tower.prioritizedTarget = this.prioritizedTarget;
            GameUI.instance.removeCurrentTowerActionsUI();
        } else {
            let tower = GameStateManagerInstance.playerB.getMap().getTowerAtPosition(new cc.p(this.x, this.y));
            if (tower === undefined) {
                return false;
            }
            tower.prioritizedTarget = this.prioritizedTarget;
        }
    }
});

ChangePrioritizedTargetAction.deserializer = function (pkg) {
    const prioritizedTarget = pkg.getByte(), x = pkg.getInt(), y = pkg.getInt(), uid = pkg.getInt();
    return new ChangePrioritizedTargetAction(prioritizedTarget, x, y, uid);
};
