
var MapController = cc.Class.extend({
    mapArray: null,
    path: null,
    intArray:null,
    createObjectByTouch:null,
    deleteObjectByTouch: null,
    mapChange:null,


    ctor:function () {
        this.createObjectByTouch = false
        this.deleteObjectByTouch = false
        this.mapChange = false
        this.mapArray =  Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1}
            )
        );
        this.path = {}
        this.intArray =  Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1},
                ()=>0
            )
        );
        for(var i=1; i<=MAP_WIDTH;i++){
            this.intArray[i][0] = 5
        }
        for(var i=1; i<MAP_HEIGHT;i++){
            this.intArray[MAP_WIDTH][i] = 5
        }
        this.intArray[1][4] = -1
        this.intArray[4][4] = -2
        this.intArray[3][2] = -3
        // this.intArray[2][1] = 1
        this.intArray[0][4] = 1
        this.intArray[1][3] = 1
        this.intArray[5][3] = 2
        this.findPath()
        this.initCell();



    },
    init:function () {

        winSize = cc.director.getWinSize();


        return true;
    },
    initCell:function () {
        for(var i=0; i<MAP_WIDTH; i ++){
            for(var j=0; j<MAP_HEIGHT+1; j++){
                var pos = this.convertCordinateToPos(i,j)
                var cell = new Cell(this.intArray[i][j],pos)
                this.mapArray[i][j] = cell
            }
        }
    },


    findPath: function (){
        var weight =  Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1},
                ()=> 999999
            )
        );

        weight[MAP_WIDTH][MAP_HEIGHT] = 0
        weight[MAP_WIDTH-1][MAP_HEIGHT] = 50
        // weight[MAP_WIDTH-2][MAP_HEIGHT] = 50
        var startList = {};
        let finalList = {};
        var start = {
            locX: MAP_WIDTH,
            locY: MAP_HEIGHT,
            parent: MAP_WIDTH+'-'+MAP_HEIGHT,
            direc: 6
        }
        var start2 = {
            locX: MAP_WIDTH-1,
            locY: MAP_HEIGHT-1,
            parent: (MAP_WIDTH-1)+'-'+MAP_HEIGHT,
            direc: 8
        }
        var start3 = {
            locX: MAP_WIDTH-1,
            locY: MAP_HEIGHT,
            parent: MAP_WIDTH+'-'+MAP_HEIGHT,
            direc: 6
        }
        // if(this.intArray[MAP_WIDTH-1][MAP_HEIGHT-1] <= 0) {
        //     startList[start2.locX + '-' + start2.locY] = start2
        // }
        if(this.intArray[MAP_WIDTH-1][MAP_HEIGHT] <= 0)
        {
            startList[start3.locX + '-' + start3.locY] = start3
        }
        finalList[start.locX+'-'+start.locY] = start
        var cou = 0
        while(Object.keys(startList).length >0){
        //     for(var i=0; i <3; i++){
            var nodeClosest = this.getClosestToFinal(startList, weight, finalList)
            this.addNearby(nodeClosest, startList, finalList, weight);
            cou++
            if(cou>100) break
        }
        this.path = finalList
        var des = {
            locX: MAP_WIDTH-2,
            locY: MAP_HEIGHT,
            parent: (MAP_WIDTH-1)+'-'+MAP_HEIGHT,
            direc: 6
        }
        // for(var i=0; i<MAP_WIDTH;i++){
        //     for(var j=0; j<=MAP_HEIGHT;j++){
        //         cc.log(i+'='+j+' '+weight[i][j])
        //     }
        // }
        for(key in finalList){
            var x = finalList[key].locX
            var y = finalList[key].locY
            cc.log(x+'='+y+' '+finalList[key].parent+'--'+finalList[key].direc)
        }

    },

    getWay:function (finalList, weight){
        var corX = 0
        var corY = 0
        var parentX = 0
        var parentY = 1
        var cou = 0
        while(corX != MAP_WIDTH-1 || corY != MAP_HEIGHT){

            if(weight[corX][corY] - weight[parentX][parentY] == 50){
                var tmpX = (parentX*2-corX)
                var tmpY = (parentY*2-corY)
                finalList[parentX+'-'+parentY].parent = tmpX+'-'+tmpY
                corX = parentX
                corY = parentY
                parentX = tmpX
                parentY = tmpY
            }else if(weight[corX][corY] - weight[parentX][parentY] > 50){
                var tmpX = 0
                var tmpY = 0
                if(parentX + parentY- corY <0 || parentX + parentY- corY>=MAP_WIDTH || parentY+parentX-corX<0 || parentY+parentX-corX >MAP_HEIGHT){
                    tmpX = parentX - parentY+corY
                    tmpY = parentY - parentX + corX
                }else if(parentX - parentY+corY <0 || parentX - parentY+corY>=MAP_WIDTH || parentY-parentX+corX<0 || parentY-parentX+corX >MAP_HEIGHT){
                    tmpX = parentX + parentY- corY
                    tmpY = parentY + parentX - corX
                }
                else if(weight[parentX + parentY- corY][parentY+parentX-corX] < weight[parentX - parentY+ corY][parentY-parentX+corX] ){
                    tmpX = parentX + parentY- corY
                    tmpY = parentY + parentX - corX
                }else {
                    tmpX = parentX - parentY+corY
                    tmpY = parentY - parentX + corX
                }
                finalList[parentX+'-'+parentY].parent = tmpX+'-'+tmpY
                corX = parentX
                corY = parentY
                parentX = tmpX
                parentY = tmpY

            }

            cou++
            if(cou>100) break
        }
        return finalList

    },

    addNearby: function (node, startList, finalList, weight){
        var rightLocX = node.locX+1;
        var leftLocX = node.locX-1;
        var douwnLocY = node.locY-1;
        var upLocY = node.locY+1;
        var direction = node.direc;
        var _parent = node.locX+'-'+node.locY;

        if(this.isNearby(node.locX, node.locY-1, finalList)){
            var weightBetween2Node = 50
            if(direction != 8) {
                weightBetween2Node = 51
            }
            if( weight[node.locX][node.locY] + weightBetween2Node < weight[node.locX][node.locY-1] ){
                weight[node.locX][node.locY-1] = weight[node.locX][node.locY] + weightBetween2Node
                var newNode = this.createNewNode(node.locX, (node.locY-1),_parent, 8)
                startList[node.locX+'-'+(node.locY-1)] = newNode
            }
        }
        if(this.isNearby(node.locX+1, node.locY, finalList)){
            var weightBetween2Node = 50
            if(direction != 4) {
                weightBetween2Node = 51
            }
            if( weight[node.locX][node.locY] + weightBetween2Node < weight[node.locX+1][node.locY] ){
                weight[node.locX+1][node.locY] = weight[node.locX][node.locY] + weightBetween2Node
                var newNode = this.createNewNode(node.locX+1, node.locY,_parent, 4)
                startList[(node.locX+1)+'-'+node.locY] = newNode
            }
        }
        if(this.isNearby(node.locX-1, node.locY, finalList)){
            var weightBetween2Node = 50
            if(direction != 6) {
                weightBetween2Node = 51
            }
            if( weight[node.locX][node.locY] + weightBetween2Node < weight[node.locX-1][node.locY] ){
                weight[node.locX-1][node.locY] = weight[node.locX][node.locY] + weightBetween2Node
                var newNode = this.createNewNode(node.locX-1, node.locY,_parent, 6)
                startList[(node.locX-1)+'-'+node.locY] = newNode
            }
        }
        if(this.isNearby(node.locX, node.locY+1, finalList)){
            var weightBetween2Node = 50
            if(direction != 2) {
                weightBetween2Node = 51
            }
            if( weight[node.locX][node.locY] + weightBetween2Node < weight[node.locX][node.locY+1] ){
                weight[node.locX][node.locY+1] = weight[node.locX][node.locY] + weightBetween2Node
                var newNode = this.createNewNode(node.locX, node.locY+1,_parent, 2)
                startList[node.locX+'-'+(node.locY+1)] = newNode

            }
        }


        return weight

    },

    createNewNode: function (locX, locY, parent, direc){
        var newNode = {
            locX : locX,
            locY: locY,
            parent: parent,
            direc: direc
        }
        return newNode;
    },

    isNearby: function (locX, locY, finalList){
        if(locX <= MAP_WIDTH && locX >=0 && locY <= MAP_HEIGHT && locY >=0) {
            if (this.intArray[locX][locY] <= 0 && finalList[locX + '-' + locY] == undefined) {
                return true;
            }
        }
        return false;
    },

    getClosestToFinal: function (startList, weight,finalList){
        var minValue = 999999
        var minKey = null
        for(key in startList){
            var x = startList[key].locX
            var y = startList[key].locY
            if(weight[x][y] <= minValue){
                minValue = weight[x][y]
                minKey = key
                // cc.log(minKey)
                // cc.log('=============')
            }
        }
        var locX = startList[minKey].locX
        var locY = startList[minKey].locY
        finalList[locX+'-'+locY] = startList[minKey]
        var nodeClosest = startList[minKey]
        delete startList[minKey]
        return nodeClosest
    },

    convertCordinateToPos:function (corX, corY) {
        var x = winSize.width/2 - WIDTHSIZE/2 + (corX+1)*CELLWIDTH
        var y = winSize.height/2 - HEIGHTSIZE/2 + (MAP_HEIGHT- corY+3.5)*CELLWIDTH
        var p = new cc.p(x,y)
        return p

    },
    convertPosToCor:function (pos) {
        var x = Math.floor((pos.x-winSize.width/2+WIDTHSIZE/2)/CELLWIDTH-0.5)
        var y = Math.floor(MAP_HEIGHT+3.5 - (pos.y - winSize.height/2 + HEIGHTSIZE/2 )/CELLWIDTH+0.5)
        var p = new cc.p(x,y)
        return p

    },

});
