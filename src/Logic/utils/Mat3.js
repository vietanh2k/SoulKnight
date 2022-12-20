
// column major
const Mat3 = function (arr) {
    this.m = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ];

    if (arr) {
        if (arr[0][0]) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    this.m[i][j] = arr[i][j]
                }
            }
        } else {
            for (let i = 0; i < 9; i++) {
                this.m[i] = arr[i]
            }
        }
    }

    // this = m1 x m2
    this.multiplyMat = function (m1, m2) {
        const ae = m1.m;
        const be = m2.m;
        const te = this.m;

        const a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
        const a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
        const a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

        const b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
        const b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
        const b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];

        te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
        te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
        te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

        te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
        te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
        te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

        te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
        te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
        te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

        return this;
    }

    this.transformVec = function (vec2, z = 1) {
        const ret = new Vec2(0,0)

        const x = vec2.x, y = vec2.y;
        const e = this.m;

        ret.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
        ret.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

        return ret;
    }

    this.mul = function (a) {
        if (a.constructor === this.constructor) {
            const ret = new Mat3()
            return ret.multiplyMat(this, a)
        } else {
            return this.transformVec(a)
        }
    }

    this.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {
        const te = this.m;

        te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
        te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
        te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;

        return this;
    }

    this.setIdentity = function () {
        this.set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        );
    }

    // rotation matrix on 0xy plane
    this.setRotation = function (theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);

        this.set(
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        );

        return this;
    }

    this.setTranslation = function (vec) {
        this.set(

            1, 0, vec.x,
            0, 1, vec.y,
            0, 0, 1

        );

        return this;
    }

    this.getColumn = function (i) {
        const e = this.m;
        const c = i * 3
        return [e[c], e[c + 1], e[c + 2]]
    }

    this.getPosition = function () {
        const e = this.m;
        return new Vec2(e[6] / e[8], e[7] / e[8])
    }

    this.toString = function () {
        const e = this.m
        let ret = '['

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                ret += e[i * 3 + j]
            }
            ret += ']\n'
        }

        return ret
    }
}