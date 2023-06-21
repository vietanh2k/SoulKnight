const checkColisionRectInMap = function (l, r, u , d, mapArr) {
    var l = Math.floor((newPos.x - this.radius)/60);
    var r = Math.floor((newPos.x + this.radius)/60);

    var u = Math.floor((newPos.y + this.radius)/60);
    var d = Math.floor((newPos.y - this.radius)/60);
    for(var i =l; i<= r; i++){
        if(mapArr[i][u] === 1){
            return false
        }
        if(mapArr[i][d] === 1){
            return false
        }
    }
    for(var i =d; i<= u; i++){
        if(mapArr[l][i] === 1){
            return false
        }
        if(mapArr[r][i] === 1){
            return false
        }
    }
    return true;
};

const checkColision2DoanThang = function (p0, p1, q0, q1) {     //p0,p1 la 2 diem dau va cuoi cua doan thang
    p0 = getIntVector(p0);
    p1 = getIntVector(p1);
    q0 = getIntVector(q0);
    q1 = getIntVector(q1);

    var AB = cc.pSub(p1, p0); // vector AB
    var CD = cc.pSub(q1, q0); // vector CD
    var n1 = cc.p(-AB.y, AB.x); // vector pháp tuyến của AB
    var n2 = cc.p(-CD.y, CD.x); // vector pháp tuyến của CD
    // Tính giao điểm của hai đường thẳng

    var d1 = cc.pDot(n1, p0); // hằng số d của AB
    var d2 = cc.pDot(n2, q0); // hằng số d của CD

    var det = cc.pCross(n1, n2);
    if (det == 0) {
        // hai đường thẳng song song, không có điểm giao nhau
        return null;
    } else {
        // intersection là điểm giao nhau của hai đường thẳng AB và CD
        var intersection = cc.p(-(d2 * AB.x - d1 * CD.x) / det, -(d2 * AB.y - d1 * CD.y) / det);
        let x = intersection.x
        let y= intersection.y

        // Kiểm tra xem giao điểm có nằm trên cả hai đoạn thẳng hay không
        if (
            x < Math.min(p0.x, p1.x) ||
            x > Math.max(p0.x, p1.x) ||
            x < Math.min(q0.x, q1.x) ||
            x > Math.max(q0.x, q1.x) ||
            y < Math.min(p0.y, p1.y) ||
            y > Math.max(p0.y, p1.y) ||
            y < Math.min(q0.y, q1.y) ||
            y > Math.max(q0.y, q1.y)
        ) {
            // Giao điểm không nằm trên cả hai đoạn thẳng
            return null;
        } else {
            // Giao điểm nằm trên cả hai đoạn thẳng
            return new cc.p(x,y);
        }
    }



}

const isPointInsideHCN= function (p0, tamHCN, w1, h1) {
    p0 = getIntVector(p0);
    tamHCN = getIntVector(tamHCN);
    let GiaoDiem = null;
    if(p0.x >= tamHCN.x-w1/2 && p0.x <= tamHCN.x +w1/2
        && p0.y >= tamHCN.y - h1/2 && p0.y <= tamHCN.y + h1/2){
        GiaoDiem = new cc.p(p0.x, p0.y);
    }
    return GiaoDiem;
}

const getColisionDoanThangVaHCN = function (p0, p1, tamHCN, w1, h1) {     //p0,p1 la 2 diem dau va cuoi cua doan thang
    // cc.log("start")
    // cc.log(p0.x+" "+p0.y+" "+p1.x+" "+p1.y)
    // cc.log(tamHCN.x+" "+tamHCN.y+" "+w1+" "+h1)
    p0 = getIntVector(p0);
    p1 = getIntVector(p1);
    tamHCN = getIntVector(tamHCN);
    let giaoDiem = null;
    let disMin = 99999;
    let p11 = new cc.p(p1.x, p1.y);
    let lu = new cc.p(tamHCN.x - w1/2, tamHCN.y+h1/2);
    let ld = new cc.p(tamHCN.x - w1/2, tamHCN.y-h1/2);
    let ru = new cc.p(tamHCN.x + w1/2, tamHCN.y+h1/2);
    let rd = new cc.p(tamHCN.x + w1/2, tamHCN.y-h1/2);
    let d1 = checkColision2DoanThang(p0, p11, lu, ld);
    if(d1 != null){
        giaoDiem = new cc.p(d1.x, d1.y);
        p11 = new cc.p(d1.x, d1.y);
    }
    let d2 = checkColision2DoanThang(p0, p11, lu, ru);
    if(d2 != null){
        giaoDiem = new cc.p(d2.x, d2.y);;
        p11 = d2;
    }
    let d3 = checkColision2DoanThang(p0, p11, rd, ld);
    if(d3 != null){
        giaoDiem = new cc.p(d3.x, d3.y);;
        p11 = d3;
    }
    let d4 = checkColision2DoanThang(p0, p11, rd, ru);
    if(d4 != null){
        giaoDiem = new cc.p(d4.x, d4.y);;
    }
    // if(giaoDiem != null) cc.log("trueeeeeeeeeeeeeee")
    return giaoDiem;

}

// const checkColisionWithWall = function (pos) {
//     let ret = false;
//     if()
//
// }