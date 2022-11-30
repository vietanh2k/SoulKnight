const Route = function (
    points = [new Vec2(0, 500), new Vec2(400, 500)]
) {
    this.points = points

    // pointId          : number    - index in this.points, represents the previous point the object has been passed
    // currentPosition  : Vec2      - position of object
    // d                : number    - how many meters it move along route
    // new position of object will be filled to currentPosition
    // return next partId
    this.drive = function (pointId, currentPosition, d, repeat = true) {
        if (!repeat && pointId === this.points.length - 1) {
            return pointId
        }

        if (d === 0) return pointId

        let nextPointId = null

        if (pointId >= this.points.length) {
            nextPointId = 0
        } else {
            nextPointId = (pointId + 1) % this.points.length
        }

        const nextPoint = this.points[nextPointId]

        const translation = nextPoint.sub(currentPosition)
        const length = translation.length()
        const direction = translation.div(length)

        if (length < d) {
            const remain = d - length
            currentPosition.set(nextPoint.x, nextPoint.y)
            return this.drive(nextPointId, currentPosition, remain)
        } else {
            const ret = currentPosition.add(direction.mul(d))
            currentPosition.set(ret.x, ret.y)
            return pointId
        }
    }

    this.count = function () {
        return this.points.length
    }
}