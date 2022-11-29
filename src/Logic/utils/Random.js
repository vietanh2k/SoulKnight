const Random = {
    m_w: 0,
    m_z: 0,
    mask: 0xffffffff,

    seed: function (i) {
        this.m_w = (123456789 + i) & this.mask;
        this.m_z = (987654321 - i) & this.mask;
    },

    range: function (min, max) {
        return Math.random() * (max - min) + min
    },

    rangeInt: function (min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}