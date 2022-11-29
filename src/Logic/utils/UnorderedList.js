const UnorderedList = function (reservedSize = 1024) {
    this.objs = new Array(reservedSize)
    this.objs.length = 0
    this.objFreeIds = new Array(reservedSize)
    this.objFreeIds.length = 0
    this.objsCount = 0

    // return id
    this.add = function (obj) {
        this.objsCount++

        let ret = 0
        if (this.objFreeIds.length === 0) {
            ret = this.objs.length
            this.objs.push(obj)
        } else {
            const id = this.objFreeIds.pop()
            this.objs[id] = obj
            ret = id
        }
        return ret
    }

    this.remove = function (id) {
        if (this.objs[id]) {
            if (--this.objsCount === 0) {
                this.objs.length = 0
                this.objFreeIds.length = 0
                return
            }

            this.objs[id] = null
            this.objFreeIds.push(id)
        }
    }

    this.forEach = function (callback) {
        for (let i = 0; i < this.objs.length; i++) {
            const obj = this.objs[i]
            if (obj != null) {
                if (callback(obj, i, this)) {
                    break
                }
            }
        }
    }

    this.size = function () {
        return this.objsCount
    }

    this.get = function (i) {
        return this.objs[i]
    }

    this.set = function (i, v) {
        this.objs[i] = v
    }
}