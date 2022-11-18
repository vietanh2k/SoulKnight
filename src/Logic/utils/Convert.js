

    const convertIndexToPos = function (corX, corY,rule) {
        var x,y
        if(rule == 1){
            x = winSize.width/2 - WIDTHSIZE/2 + (corX+1)*CELLWIDTH
            y = winSize.height/2 - HEIGHTSIZE/2 + (MAP_HEIGHT- corY+3.5)*CELLWIDTH
        }else{
            x = winSize.width/2 - WIDTHSIZE/2 + (7-corX)*CELLWIDTH
            y = winSize.height/2 - HEIGHTSIZE/2 + (MAP_HEIGHT + corY+3.5)*CELLWIDTH
        }
        var p = new cc.p(x,y)
        return p

    };
    const convertPosToIndex = function(pos, rule) {
        var x,y
        if(rule == 1) {
            x = Math.floor((pos.x - winSize.width / 2 + WIDTHSIZE / 2) / CELLWIDTH - 0.5)
            y = Math.floor(MAP_HEIGHT + 3.5 - (pos.y - winSize.height / 2 + HEIGHTSIZE / 2) / CELLWIDTH + 0.5)
        }else{
            x = Math.floor(MAP_WIDTH-(pos.x - winSize.width / 2 + WIDTHSIZE / 2) / CELLWIDTH + 0.5)
            y = Math.floor((pos.y - winSize.height / 2 + HEIGHTSIZE / 2) / CELLWIDTH-MAP_HEIGHT - 3.5 + 0.5)
        }
        var p = new cc.p(x,y)
        return p

    };

