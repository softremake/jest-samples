import { samples } from '../lib'

function catchLog() {
    let outputData = ''
    console['log'] = (...inputs) => {
        outputData += inputs.join(' ') + '\n'
    }

    return () => outputData
}

test('1 check all, no debug', () => {
    samples(
        (ex) => {
            return { result: ex }
        },
    )
        .add(0, 'test 1')
        .add(0, 'test 2')
        .checkAll((out) => expect(out).toMatchSnapshot())
})

test('2 check all, debug', () => {
    let getLog = catchLog()

    samples(
        (ex) => {
            return { result: ex }
        },
    )
        .add(0, 'test 1')
        .add(1, 'test 2')
        .checkAll((out) => console.log('ERROR'))


    expect(getLog()).toMatchSnapshot()
})

test('3 check every, no debug', () => {
    samples(
        (ex) => {
            return 'yes'
        },
    )
        .add(0, 'test 1', 'yes')
        .add(0, 'test 2', 'yes')
        .checkEach(
            (sample, result, ln, check) => expect(result).toMatch(check)
        )
})

test('4 check every, debug', () => {
    let getLog = catchLog()

    samples(
        (ex) => {
            return 'yes'
        },
    )
        .add(0, 'test 1', 'yes')
        .add(1, 'test 2', 'yes')
        .checkEach(
            (sample, result, ln, check) => console.log('ERROR')
        )

    expect(getLog()).toMatchSnapshot()
})

test('5 custom check, no debug', () => {
    let results = []

    samples(
        (ex) => {
            return 'yes'
        },
    )
        .add(0, 'test 1', 'yes')
        .add(0, 'test 2', 'yes')
        .check(
            (sample, result, ln, check) => {
                expect(result).toMatch(check)

                results.push(result)
            },
            () => expect(results).toMatchSnapshot()
        )
})
