var LogState = cc.Class.extend({

    ctor: function () {
        this.isERROR = false;
        this.dirState = "../logClient/logState/user" + gv.gameClient._userId + "/"
        this.dirSumState = "../logClient/logSumState/user" + gv.gameClient._userId + "/"
        jsb.fileUtils.createDirectory(this.dirState)
        jsb.fileUtils.createDirectory(this.dirSumState)

        this.deltaMonster = 0.1;
        this.deltaTree = 0.1;
        this.deltaTower = 0.1;
        this.deltaBullet = 0.1;
        this.deltaEnergy = 0.1;
    },

    logToFile: function (game, countLoop) {
        var content = ""
        var sumMonster = 0
        content += "===>>>>> MONSTER:    [x - y - current HP]\n"
        // Log monster
        content += "\nNumber of monster map A: " + game.playerA.getMap().getMonsters().size()


        let monstersA = game.playerA.getMap().getMonsters();
        monstersA.forEach(monster => {
            content += "\n" + ". ["
                + monster.position.x + " - "
                + monster.position.y + " - "
                + monster.health + " - "
                + monster.name + "]"

            sumMonster += monster.position.x + monster.position.y + monster.health
        });

        content += "\n\nNumber of monster map B: " + game.playerB.getMap().getMonsters().size()

        let monstersB = game.playerB.getMap().getMonsters();
        monstersB.forEach(monster => {
            content += "\n" + ". ["
                + monster.position.x + " - "
                + monster.position.y + " - "
                + monster.health + " - "
                + monster.name + "]"

            sumMonster += monster.position.x + monster.position.y + monster.health
        });


        // Log tower
        content += "\n\n\n===>>>>> TOWER:    [x - y]"
        var sumTower = 0

        content += "\nNumber of tower map A: " + game.playerA.getMap().towers.size()

        let towersA = game.playerA.getMap().towers;
        towersA.forEach(tower => {
            content += "\n" + ". ["
                + tower.position.x + " - "
                + tower.position.y + " - " + "]"

            sumTower += tower.position.x + tower.position.y
        });

        content += "\n\nNumber of tower map B: " + game.playerB.getMap().towers.size()

        let towersB = game.playerB.getMap().towers;
        towersB.forEach(tower => {
            content += "\n" + ". ["
                + tower.position.x + " - "
                + tower.position.y + " - " + "]"

            sumTower += tower.position.x + tower.position.y
        });

        // Log bullet
        content += "\n\n\n===>>>>> BULLET:    [x - y - damage - bulletID]"
        var sumBullet = 0

        content += "\nNumber of bullet map A: " + game.playerA.getMap().bullets.size()

        let bulletsA = game.playerA.getMap().bullets;
        bulletsA.forEach(bullet => {
            content += "\n" + ". ["
                + bullet.position.x + " - "
                + bullet.position.y + " - "
                + bullet.damage + " - "
                + bullet.bulletID  + "]"

            sumBullet += bullet.position.x + bullet.position.y + bullet.damage
        });

        content += "\n\nNumber of bullet map B: " + game.playerB.getMap().bullets.size()

        let bulletsB = game.playerB.getMap().bullets;
        bulletsB.forEach(bullet => {
            content += "\n" + ". ["
                + bullet.position.x + " - "
                + bullet.position.y + " - "
                + bullet.damage + " - "
                + bullet.bulletID  + "]"

            sumBullet += bullet.position.x + bullet.position.y + bullet.damage
        });

        // Get path
        var pathState = this.dirState + "/"+ countLoop +"-client-stateFrame.txt"
        var pathSumState = this.dirSumState + "/"+ countLoop +"-client-sumStateFrame.txt"

        this.dirSumStateServer = "../logServer/logSumState/user" + gv.gameClient._userId + "/"
        var pathSumStateServer = this.dirSumStateServer + "/"+ countLoop +"-server-sumStateFrame.txt"

        // Compare with server state
        var sumStateServer = jsb.fileUtils.getStringFromFile(pathSumStateServer)
        var sum = sumStateServer.split("\n");
        var svSumMonster = Number(sum[0])
        var svSumTower = Number(sum[1])
        var svSumBullet = Number(sum[2])


        this.logError(sumMonster, svSumMonster, countLoop, "Monster", 0.1)
        this.logError(sumTower, svSumTower, countLoop, "Tower", 0.1)
        this.logError(sumBullet, svSumBullet, countLoop, "Bullet", 0.1)


        var contentSum = sumMonster + "\n" +  sumTower + "\n" + sumBullet + "\n";

        // Log state to file
        jsb.fileUtils.writeStringToFile(content, pathState);
        jsb.fileUtils.writeStringToFile(contentSum, pathSumState);
    },

    logError: function (client, server, countLoop, txt, delta) {
        if (Math.abs(client - server) > delta && !this.isERROR) {
            // Utils.addToastToRunningScene('LỖI');
            cc.log("\n\n==================================="
                +"\n==================================="
                +"\n==================================="
                +"\n===================================\n\n"
                + txt + " - USER " + gv.gameClient._userId + " - ERROR STATE AT FRAME: " + countLoop + "\n"
            + "\n\n==================================="
            +"\n==================================="
            +"\n==================================="
            +"\n===================================\n\n")
            this.isERROR = true;

            // switch (txt) {
            //     case "Monster": {
            //         this.deltaMonster = delta + Math.abs(client - server)
            //         break
            //     }
            //     case "Tree": {
            //         this.deltaTree = delta + Math.abs(client - server)
            //         break
            //     }
            //     case "Tower": {
            //         this.deltaTower = delta + Math.abs(client - server)
            //         break
            //     }
            //     case "Bullet": {
            //         this.deltaBullet = delta + Math.abs(client - server)
            //         break
            //     }
            //     case "Energy": {
            //         this.deltaEnergy = delta + Math.abs(client - server)
            //         break
            //     }
            // }
        }
    }
})

var _logState;
LogState.getInstance = function () {
    if (_logState === undefined)
        _logState = new LogState();
    return _logState;
}