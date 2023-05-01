var utils = utils || {}

utils.String = {
    isCharCodeDigit: function (c) {
        return c >= 48 && c <= 57
    },

    format: function (fmt, ...argv) {
        let ch
        let argId = 0
        let prev = 0
        let ret = ''

        for (let i = 0; i < fmt.length; i++) {
            ch = fmt.charCodeAt(i)

            // ch == '%'
            if (ch === 37) {
                if (i === fmt.length - 1) break

                ret = ret + fmt.substring(prev, i)

                ch = fmt.charCodeAt(++i)

                const start = i

                while (this.isCharCodeDigit(ch) && i !== fmt.length - 1) {
                    ch = fmt.charCodeAt(++i)
                }

                const end = i
                prev = i + 1

                const numPad = parseInt(fmt.substring(start, end))

                switch (ch) {
                    case 100:
                        ret = ret + utils.Number.pad(argv[argId++], numPad)
                        break
                    default:
                        throw '[Error]: fmt implement'
                }
            }
        }

        if (prev !== fmt.length - 1) {
            ret = ret + fmt.substring(prev, fmt.length)
        }

        return ret
    }
}