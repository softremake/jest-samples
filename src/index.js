const re = new RegExp(/:(\d+):\d+\)$/)

function __line() {
    const trace = ((new Error().stack).split('at ')[3]).trim()
    const m = re.exec(trace)
    return (m && m.length > 0) ? m[1] : 0
}

class Samples {
    constructor(testFn) {
        this._samples = []
        this._output = []
        if (!testFn || typeof testFn !== 'function') throw new Error('Samples need testFn as a callback function')
        this.testFn = testFn

        this._collectFn = (example, result, ln, test) => {
            this._output.push({
                example,
                ln,
                result,
                test,
            })
        }

        this._dbgFn = (sample, result, ln, test) => {
            console.log(sample, 'at', ln)
            if (test) console.log('test', test)
            console.log('output', JSON.stringify(result, null, 2))
        }
    }

    add(dbg, example, test = null) {
        const ln = __line()

        this._samples.push({
            ln,
            example,
            dbg,
            test,
        })

        return this
    }

    checkAll(cb) {
        this.check(null, cb)
    }

    checkEach(cb) {
        this.check(cb, null)
    }

    check(collectFn, doneFn = null) {
        let hasIsolates = false

        for (let ex of this._samples) {
            if (ex.dbg) {
                hasIsolates = true
                break
            }
        }

        for (let ex of this._samples) {
            if (!hasIsolates || ex.dbg) {
                const result = this.testFn(ex.example)

                if (ex.dbg) {
                    this._dbgFn(ex.example, result, ex.ln, ex.test)
                } else {
                    collectFn = collectFn ? collectFn : this._collectFn
                    collectFn(ex.example, result, ex.ln, ex.test)
                }
            }
        }

        if (!hasIsolates && doneFn) doneFn(this._output)
    }

}

export function samples(testFn) {
    return new Samples(testFn)
}
