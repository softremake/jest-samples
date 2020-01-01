# jest-samples
Samples based testing for Jest

Install by `npm i git+https://github.com/softremake/jest-samples.git` or `yarn add git+https://github.com/softremake/jest-samples.git` 

Sometimes you want to test multiple variants with the same code and using Jest's snapshots.
Now you can do it by the code like this:

```
import { samples } from 'jest-samples'

test('test jest-samples', () => {
    samples(
        // this function is to provide an output, in this example we return { result: ex } object
        (ex) => {
            return { result: ex }
        },
    )
        .add(0, 'test 1') // if all variants are marked with 0 then we compare against a snapshot
        .add(0, 'test 2') 
        .checkAll((out) => expect(out).toMatchSnapshot())
})
```

During development you might need to *isolate* some samples:

```
test('test jest-samples isolates', () => {
    samples(
        (ex) => {
            return { result: ex }
        },
    )
    /* we isolate by using 1 as a first parameter, in this case we don't use snapshots, 
    but we log the output to the console, along with line numbers of a sample */
        .add(1, 'test 1') 
        .add(0, 'test 2') 
        .checkAll((out) => expect(out).toMatchSnapshot())
})
```
