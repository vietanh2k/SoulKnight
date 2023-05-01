var utils = utils || {}

utils.Number = {
    pad: function (num, size) {
        num = num.toString()
        while (num.length < size) num = "0" + num
        return num
    },

    lerp: function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount
        amount = amount > 1 ? 1 : amount
        return value1 + (value2 - value1) * amount
    },

    smoothstep: function (min, max, value) {
        if (value < 0)
            return min

        if (value >= 1)
            return max

        const d = (max-min)
        const x = (value-min) / d
        return x * x * (3 - 2 * x) * d + min
    },

    clamp: (num, min, max) => Math.min(Math.max(num, min), max)
}