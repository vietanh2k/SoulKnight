/**
 * Đối tượng Map trong thiết kế
 * */
MAP_WIDTH = 20;
MAP_HEIGHT= 15;
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
        this.init();
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
                let time2 = Date.now();
                cc.log(time2)
                cc.log(time2-time1)
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
