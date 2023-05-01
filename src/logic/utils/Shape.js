const Circle = {
    isCirclesOverlapped: function (c1, r1, c2, r2) {
        const distanceX = c1.x - c2.x;
        const distanceY = c1.y - c2.y;
        const radiusSum = r1 + r2;
        return distanceX * distanceX + distanceY * distanceY < radiusSum * radiusSum;
    }
}