
var MapController = cc.Class.extend({
    mapArray: null,
    path: null,
    intArray:null,
    createObjectByTouch:null,
    deleteObjectByTouch: null,
    mapChange:null,


    ctor:function (arr, rule) {
        this.createObjectByTouch = false
        this.deleteObjectByTouch = false
        this.mapChange = false
        this.rule = rule
        this.mapArray =  Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1}
            )
        );
        this.listPath =  Array.from(
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
        for(var i=0; i<MAP_WIDTH;i++){
            for(var j=0; j <MAP_HEIGHT;j++){
                this.intArray[i][j+1] = arr[i][j]
            }
        }

        // this.findPath()
        this.findPathBFS()
        this.initCell();



    },
    init:function () {

        winSize = cc.director.getWinSize();


        return true;
    },
    initCell:function () {
        for(var i=0; i<MAP_WIDTH; i ++){
            for(var j=0; j<MAP_HEIGHT+1; j++){
                var pos = convertIndexToPos(i,j,this.rule)
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
        // for(key in finalList){
        //     var x = finalList[key].locX
        //     var y = finalList[key].locY
        //     cc.log(x+'='+y+' '+finalList[key].parent+'--'+finalList[key].direc)
        // }

    },

    findPathBFS: function (){
        var listPath = Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1}
            )
        );
        var arr =Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1},
                ()=>0
            )
        );
        for(var i=0; i<=MAP_WIDTH;i++){
            for(var j=0; j<=MAP_HEIGHT; j++){
                if(this.intArray[i][j] <= 0) arr[i][j] = 0
                else arr[i][j] = 1
            }
        }
        var offsetX = [1, 0,-1, 0]
        var offsetY = [0, 1, 0,-1]
        var queue = []
        var des = new Vec2(MAP_WIDTH,MAP_HEIGHT)
        listPath[des.x][des.y] = des
        queue.push(des)
        var cou =0
        while (queue.length >0){
            var node = queue[0]
            for(var i=0; i<4;i++){
                var direc= new Vec2(offsetX[i], offsetY[i])
                var adj = node.add(direc)
                if (adj.x >= 0 && adj.y >= 0 && adj.x <= MAP_WIDTH && adj.y <= MAP_HEIGHT && arr[adj.x][adj.y] == 0 && listPath[adj.x][adj.y] == undefined) {
                    listPath[adj.x][adj.y] = node
                    queue.push(adj)
                }
            }
            queue.shift()
            cou++
            if(cou>100) break
        }
        this.listPath = listPath
        for(var i=0;i<=MAP_WIDTH;i++){
            for(j=0; j<= MAP_HEIGHT; j++){
                if(listPath[i][j] != undefined)
                cc.log(i+'_'+j+'=='+listPath[i][j].x+'_'+listPath[i][j].y)
            }
        }
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

    isExistPath:function (){
        var listPath = Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1}
            )
        );
        var arr =Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1},
                ()=>0
            )
        );
        for(var i=0; i<=MAP_WIDTH;i++){
            for(var j=0; j<=MAP_HEIGHT; j++){
                if(this.intArray[i][j] <= 0) arr[i][j] = 0
                else arr[i][j] = 1
            }
        }
        var offsetX = [1, 0,-1, 0]
        var offsetY = [0, 1, 0,-1]
        var queue = []
        var des = new Vec2(MAP_WIDTH,MAP_HEIGHT)
        listPath[des.x][des.y] = des
        queue.push(des)
        var cou =0
        while (queue.length >0){
            var node = queue[0]
            for(var i=0; i<4;i++){
                var direc= new Vec2(offsetX[i], offsetY[i])
                var adj = node.add(direc)
                if (adj.x >= 0 && adj.y >= 0 && adj.x <= MAP_WIDTH && adj.y <= MAP_HEIGHT && arr[adj.x][adj.y] == 0 && listPath[adj.x][adj.y] == undefined) {
                    listPath[adj.x][adj.y] = node
                    queue.push(adj)
                }
            }
            queue.shift()
            cou++
            if(cou>100) break
        }
        if(listPath[0][0] == undefined){
            return false
        }
        return true


    },


});
