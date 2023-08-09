/**
 * Đối tượng Map trong thiết kế
 * */
MAP_WIDTH = 20;
MAP_HEIGHT= 15;
MAP_BLOCK= 10;
var MapView = cc.Class.extend({
    ctor:function (player) {
        this.listPath = Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1}
            )
        );
        this.mapArray = Array.from(
            {length: MAP_WIDTH + 1},
            () => Array.from(
                {length: MAP_HEIGHT + 1},
                ()=>0
            )
        );
        this.listBox = {};
        // this.init();
        // this.initListPathForAllNode()

    },

    init:function () {
        for(var i =0; i<= 20; i++){
            this.mapArray[i][0] = 1;
            this.mapArray[i][15] = 1;
        }
        for(var i =0; i<= 15; i++){
            this.mapArray[0][i] = 1;
            this.mapArray[20][i] = 1;
        }
        for(var i =4; i< 6; i++){
            this.mapArray[4][i] = 1;
            this.mapArray[16][i] = 1;
        }
        for(var i =10; i< 12; i++){
            this.mapArray[4][i] = 1;
            this.mapArray[16][i] = 1;
        }

        for(var i =4; i< 8; i++){
            this.mapArray[i][12] = 1;
            this.mapArray[i][3] = 1;
        }
        for(var i =13; i< 17; i++){
            this.mapArray[i][12] = 1;
            this.mapArray[i][3] = 1;
        }

        return true;
    },

    initFromJson:function (index) {
        let map = cf.MAP[index];
        MAP_WIDTH = map.mapWidth;
        MAP_HEIGHT = map.mapHeight;
        MAP_BLOCK = map.blockArr.length;
        let blockArr = map.blockArr;
        this.mapArray = Array.from(
            {length: MAP_WIDTH + 1},
            () => Array.from(
                {length: MAP_HEIGHT + 1},
                ()=>0
            )
        );
        this.initWall();

        for(var i=0; i<blockArr.length; i++){
            let x = blockArr[i][0];
            let y = blockArr[i][1];
            if(x>=0 && x<= MAP_WIDTH && y>=0 && y<= MAP_HEIGHT){
                this.mapArray[x][y] = GAME_CONFIG.MAP_BLOCK;
            }

        }

        let boxArr = map.boxArr;
        if(boxArr.length <= 0){
            this.createRandomBox();
        }else{
            for(var i=0; i<boxArr.length; i++){
                let firstP = boxArr[i][0];
                let secP = boxArr[i][1];
                for(var m=firstP[0]; m <= secP[0]; m++){
                    for(var n=firstP[1]; n <= secP[1]; n++){
                        if(m>=0 && m<= MAP_WIDTH && n>=0 && n<= MAP_HEIGHT){
                            this.mapArray[m][n] = GAME_CONFIG.MAP_BOX;
                            let tag = m+"-"+n;
                            this.listBox[tag] = new Box(m,n);
                        }
                    }
                }
            }
        }
        this.createRandomBoomBox();

        return true;
    },

    createRandomBoomBox:function () {
        let ran = Math.floor(Math.random()*4)+6;
        for(var i=0; i< ran; i++){
            let ran1 = Math.floor(Math.random()*(MAP_WIDTH-6))+3;
            let ran2 = Math.floor(Math.random()*(MAP_HEIGHT-6))+3;
            if(this.mapArray[ran1][ran2] === 0){
                let ranBoom = Math.floor(Math.random()*3)+GAME_CONFIG.MAP_BOOMM1;
                this.mapArray[ran1][ran2] = ranBoom;
                let tag = ran1+"-"+ran2;
                if(ranBoom === GAME_CONFIG.MAP_BOOMM1) {
                    this.listBox[tag] = new BoomBox(ran1, ran2);
                }else if(ranBoom === GAME_CONFIG.MAP_BOOMM2){
                    this.listBox[tag] = new IceBox(ran1, ran2);
                }else if(ranBoom === GAME_CONFIG.MAP_BOOMM3){
                    this.listBox[tag] = new PosionBox(ran1, ran2);
                }
            }
        }
    },

    createRandomBox:function () {
        let ran = Math.floor(Math.random()*20);
        for(var i=0; i< ran; i++){
            let ran1 = Math.floor(Math.random()*(MAP_WIDTH-6))+3;
            let ran2 = Math.floor(Math.random()*(MAP_HEIGHT-6))+3;
            if(this.mapArray[ran1][ran2] === 0) {
                this.mapArray[ran1][ran2] = GAME_CONFIG.MAP_BOX;
                let tag = ran1 + "-" + ran2;
                this.listBox[tag] = new Box(ran1, ran2);
            }
        }
    },

    delBox:function (dx, dy) {
        let tag = dx+"-"+dy;
        delete this.listBox[tag];

    },

    isBlock:function (dx, dy) {
        if(dx <0 || dx >= this.mapArray.length) return false;
        if(dy <0 || dy >= this.mapArray[0].length) return false;
        if(this.mapArray[dx][dy] > 0){
            return true;
        }

        return  false;

    },

    getListPosNoneBlock:function () {
        let list = [];
        for(var i =1; i< MAP_WIDTH; i++){
            for(var j =1; j< MAP_HEIGHT; j++){
                if(!this.isBlock(i, j)){
                    list.push([i,j]);
                }
            }
        }

        return list;
    },

    getListPosNoneBlock2:function () {
        let list = [];
        for(var i =3; i< MAP_WIDTH-2; i++){
            for(var j =3; j< MAP_HEIGHT-2; j++){
                if(!this.isBlock(i, j)){
                    list.push([i,j]);
                }
            }
        }

        return list;
    },
    getAllBox:function () {
        // for(var i=0; i<this.mapArray.length; i++){
        //     for(var j=0; j<this.mapArray[0].length; j++){
        //         if(this.mapArray)
        //     }
        // }

    },

    initChestMap:function (index) {
        MAP_WIDTH = 10;
        MAP_HEIGHT = 10;
        this.mapArray = Array.from(
            {length: MAP_WIDTH + 1},
            () => Array.from(
                {length: MAP_HEIGHT + 1},
                ()=>0
            )
        );
        this.initWall();

    },

    initDesMap:function (index) {
        MAP_WIDTH = 10;
        MAP_HEIGHT = 10;
        this.mapArray = Array.from(
            {length: MAP_WIDTH + 1},
            () => Array.from(
                {length: MAP_HEIGHT + 1},
                ()=>0
            )
        );
        this.initWall();

    },

    initBossMap:function () {
        this.initFromJson(5);

    },

    initShopMap:function (index) {
        MAP_WIDTH = 16;
        MAP_HEIGHT = 10;
        this.mapArray = Array.from(
            {length: MAP_WIDTH + 1},
            () => Array.from(
                {length: MAP_HEIGHT + 1},
                ()=>0
            )
        );
        this.initWall();

    },

    initWall:function () {
        for(var i =0; i<= MAP_WIDTH; i++){
            this.mapArray[i][0] = 1;
            this.mapArray[i][MAP_HEIGHT] = 1;
        }
        for(var i =0; i<= MAP_HEIGHT; i++){
            this.mapArray[0][i] = 1;
            this.mapArray[MAP_WIDTH][i] = 1;
        }

    },

    findPathBFS:function (startRow, startCol, maxDepth) {
        let time1 = Date.now();
        let path = Array.from(
            {length:MAP_WIDTH+1},
            ()=>Array.from(
                {length:MAP_HEIGHT+1}
            )
        );
        let queue = [];
        let visited = new Set();

        // Thêm điểm bắt đầu vào queue và visited
        queue.push([startRow, startCol, 0]);
        visited.add(startRow + ',' + startCol);
        // Tạo mảng directions để duyệt các ô xung quanh
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        // Bắt đầu duyệt BFS
        while (queue.length > 0) {
            // Lấy điểm hiện tại trong queue
            const [currentRow, currentCol, depth] = queue.shift();
            // Nếu đến được đích thì trả về true
            if (depth > maxDepth) {

                return path;
            }

            // Duyệt các ô xung quanh
            for (let i = 0; i < directions.length; i++) {
                const nextRow = currentRow + directions[i][0];
                const nextCol = currentCol + directions[i][1];
                // Kiểm tra xem ô tiếp theo có trong ma trận và chưa được thăm trước đó
                if (
                    nextRow >= 0 &&
                    nextRow < MAP_WIDTH &&
                    nextCol >= 0 &&
                    nextCol < MAP_HEIGHT &&
                    !visited.has(nextRow + ',' + nextCol) &&
                    this.mapArray[nextRow][nextCol] === 0
                ) {
                    // Thêm ô tiếp theo vào queue và visited
                    queue.push([nextRow, nextCol, depth+1]);
                    visited.add(nextRow + ',' + nextCol);
                    path[nextRow][nextCol] = [currentRow, currentCol];
                    cc.log(nextRow+" "+nextCol+" === "+currentRow+" "+currentCol)
                }
            }
        }
        let time2 = Date.now();
        cc.log(time2)
        cc.log(time2-time1)
        return path;
    },

    initListPathForAllNode:function () {
        let time1 = Date.now();
        for(let i=0; i<= MAP_WIDTH; i++){
            for (let j= 0; j<=MAP_HEIGHT; j++){
                if(this.mapArray[i][j] === 0){
                    let path = this.findPathBFS(i,j, 20);
                    this.listPath[i][j] = path;
                }
            }
        }
        let time2 = Date.now();
        cc.log(time2)
        cc.log(time2-time1)
    },



});
