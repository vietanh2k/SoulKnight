const Vec2 = function (x, y) {
    this.x = x
    this.y = y

    this.add = function (r) {
        const ret = new Vec2(0, 0)
        ret.x = this.x + r.x
        ret.y = this.y + r.y
        return ret
    }

    this.sub = function (r) {
        const ret = new Vec2(0, 0)
        ret.x = this.x - r.x
        ret.y = this.y - r.y
        return ret
    }

    this.mul = function (r) {
        const ret = new Vec2(0, 0)

        if (r.constructor === this.constructor) {
            ret.x = this.x * r.x
            ret.y = this.y * r.y
        } else {
            ret.x = this.x * r
            ret.y = this.y * r
        }

        return ret
    }

    this.div = function (r) {
        const ret = new Vec2(0, 0)

        if (r.constructor === this.constructor) {
            ret.x = this.x / r.x
            ret.y = this.y / r.y
        } else {
            ret.x = this.x / r
            ret.y = this.y / r
        }

        return ret
    }

    this.dot = function (v) {
        return this.x * v.x + this.y * v.y
    }

    this.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    this.normal = function () {
        return this.div(this.length())
    }

    this.normalize = function () {
        const r = this.length()
        //if (r === 0) {
        //    cc.log("Vec2 normalize error")
        //}
        this.x = this.x / r
        this.y = this.y / r
        return this
    }

    this.equals = function (v) {
        return this.x === v.x && this.y === v.y
    }

    this.isApprox = function (v) {
        return Math.abs(this.x - v.x) < 0.00001 && Math.abs(this.y - v.y) < 0.00001
    }

    this.set = function (_x, _y) {
        this.x = _x
        this.y = _y
    }

    this.toString = function() {
        return 'Vec2(' + this.x + ', ' + this.y + ')'
    }
}

// axis-aligned rect
// bottom-left coordinate
const AARect = function (x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.isOverlap = function (aaRect) {
        return !(
            this.x + this.w      < aaRect.x
            ||  aaRect.x + aaRect.w  < this.x
            ||  this.y + this.h      < aaRect.y
            ||  aaRect.y + aaRect.h  < this.y
        )
    }

    // point is Vec2
    this.isContainPoint = function (point) {
        return !(
            this.x              > point.x
            ||  this.x + this.w     < point.x
            ||  this.y              > point.y
            ||  this.y + this.h     < point.y
        )
    }

    this.set = function (_x, _y, _w, _h) {
        this.x = _x
        this.y = _y
        this.w = _w
        this.h = _h
    }

    // center anchor point sprite
    this.setFromCCSprite = function (sprite) {
        const rect = sprite.getTextureRect()
        const pos = sprite.getPosition()
        this.x = pos.x - rect.width / 2.0
        this.y = pos.y - rect.height / 2.0

        if (rect.width === 0 || rect.height === 0) {
            return
        }

        this.w = rect.width
        this.h = rect.height
    }

    // center anchor point sprite
    this.setForCCSprite = function (sprite) {
        const rect = sprite.getTextureRect()

        sprite.setPosition(this.x + this.w / 2.0, this.y + this.h / 2.0)

        if (rect.width === 0 || rect.height === 0) {
            return
        }

        sprite.setScale(this.w / rect.width, this.h / rect.height)
    }

    this.toString = function () {
        return 'AARect('
            + this.x + ', '
            + this.y + ', '
            + this.w + ', '
            + this.h + ')'
    }
}

let euclid_distance = function (self, another){
    var euclid_distance = Math.sqrt(Math.pow(self.x-another.x, 2) + Math.pow(self.y-another.y, 2));
    return euclid_distance;
}