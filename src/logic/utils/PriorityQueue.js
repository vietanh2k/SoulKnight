var PriorityQueue = /** @class */ (function () {
    function PriorityQueue(initialCapacity, comparator) {
        this._size = 0;
        var cap = initialCapacity !== null && initialCapacity !== void 0 ? initialCapacity : 11;
        var com = comparator !== null && comparator !== void 0 ? comparator : null;
        if (cap < 1) {
            throw new Error('initial capacity must be greater than or equal to 1');
        }
        this._queue = new Array(cap);
        this._comparator = com;
    }
    PriorityQueue.prototype.grow = function () {
        var oldCapacity = this._size;
        // Double size if small; else grow by 50%
        var newCapacity = oldCapacity + (oldCapacity < 64 ? oldCapacity + 2 : oldCapacity >> 1);
        //if (!Number.isSafeInteger(newCapacity)) {
        //  throw new Error('capacity out of range');
        //}
        this._queue.length = newCapacity;
    };
    PriorityQueue.prototype.siftup = function (k, item) {
        if (this._comparator !== null) {
            this.siftupUsingComparator(k, item);
        }
        else {
            this.siftupComparable(k, item);
        }
    };
    /**
     * siftup of heap
     */
    PriorityQueue.prototype.siftupUsingComparator = function (k, item) {
        while (k > 0) {
            // find the parent
            var parent_1 = (k - 1) >>> 1;
            var e = this._queue[parent_1];
            // compare item with it parent, if item's priority less, break siftup and insert
            if (this._comparator(item, e) >= 0) {
                break;
            }
            // if item's priority more, make it's parent sink and proceed siftup
            this._queue[k] = e;
            k = parent_1;
        }
        // if k === 0, then we directly insert it
        this._queue[k] = item;
    };
    PriorityQueue.prototype.siftupComparable = function (k, item) {
        while (k > 0) {
            var parent_2 = (k - 1) >>> 1;
            var e = this._queue[parent_2];
            if (item.toString().localeCompare(e.toString()) >= 0) {
                break;
            }
            this._queue[k] = e;
            k = parent_2;
        }
        this._queue[k] = item;
    };
    PriorityQueue.prototype.sink = function (k, item) {
        if (this._comparator !== null) {
            this.sinkUsingComparator(k, item);
        }
        else {
            this.sinkComparable(k, item);
        }
    };
    PriorityQueue.prototype.sinkUsingComparator = function (k, item) {
        var half = this._size >>> 1;
        while (k < half) {
            var child = (k << 1) + 1;
            var object = this._queue[child];
            var right = child + 1;
            // compare left right child, assgn child the bigger one
            if (right < this._size && this._comparator(object, this._queue[right]) > 0) {
                object = this._queue[(child = right)];
            }
            //compare item and child if bigger is item, break
            if (this._comparator(item, object) <= 0) {
                break;
            }
            this._queue[k] = object;
            k = child;
        }
        this._queue[k] = item;
    };
    PriorityQueue.prototype.sinkComparable = function (k, item) {
        var half = this._size >>> 1;
        while (k < half) {
            var child = (k << 1) + 1;
            var object = this._queue[child];
            var right = child + 1;
            if (right < this._size &&
                object.toString().localeCompare(this._queue[right].toString())) {
                object = this._queue[(child = right)];
            }
            if (item.toString().localeCompare(object.toString()) <= 0) {
                break;
            }
            this._queue[k] = object;
            k = child;
        }
        this._queue[k] = item;
    };
    PriorityQueue.prototype.indexOf = function (item) {
        for (var i = 0; i < this._queue.length; i++) {
            if (this._queue[i] === item) {
                return i;
            }
        }
        return -1;
    };
    PriorityQueue.prototype.add = function (item) {
        var i = this._size;
        if (i >= this._queue.length) {
            this.grow();
        }
        this._size = i + 1;
        if (i === 0) {
            this._queue[0] = item;
        }
        else {
            this.siftup(i, item);
        }
        return true;
    };
    PriorityQueue.prototype.poll = function () {
        if (this._size === 0) {
            return null;
        }
        var s = --this._size;
        var result = this._queue[0];
        var x = this._queue[s];
        this._queue.slice(s, 1);
        if (s !== 0) {
            this.sink(0, x);
        }
        return result;
    };
    PriorityQueue.prototype.peek = function () {
        return this._size === 0 ? null : this._queue[0];
    };
    PriorityQueue.prototype.contains = function (item) {
        return this.indexOf(item) !== -1;
    };
    PriorityQueue.prototype.clear = function () {
        for (var _i = 0, _a = this._queue; _i < _a.length; _i++) {
            var item = _a[_i];
            // @ts-ignore:
            item = null;
        }
        this._size = 0;
    };
    PriorityQueue.prototype.size = function () {
        return this._size;
    };
    PriorityQueue.prototype.empty = function () {
        return this._size === 0;
    };
    PriorityQueue.prototype.toArray = function () {
        return this._queue.filter(function (item) { return item; });
    };
    PriorityQueue.prototype.toString = function () {
        return this.toArray().toString();
    };
    return PriorityQueue;
}());