const Random = {
    m_w: 0,
    m_z: 0,
    mask: 0xffffffff,

    seed: function (i) {
        this.m_w = (123456789 + i) & this.mask;
        this.m_z = (987654321 - i) & this.mask;
    },

    random: function () {
        this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
        this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
        var result = ((this.m_z << 16) + (this.m_w & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    },

    range: function (min, max) {
        return this.random() * (max - min) + min
    },

    rangeInt: function (min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(this.random() * (max - min + 1) + min)
    }
}