// @flow

import fs from 'fs'
import { EOL } from 'os'
import yargs from 'yargs'
import { forEach } from 'ramda'

import {
  calculateSourceTypeComplexity,
  type ErrorMessage,
  type TypeAliasName,
  type TypeComplexity,
  type TypeComplexityMap
} from './type-complexity'

const printErrors = (errors: ErrorMessage[]) =>
  forEach(console.error, errors)

const printTypeComplexity = (c: TypeComplexity, name: TypeAliasName) =>
  console.log(`${name}: { unions: ${c.unions}, primitives: ${c.primitives} }`)

const printAllComplexities = (complexityMap: TypeComplexityMap) =>
  complexityMap
    .forEach(printTypeComplexity)

const print5Complexities = (complexityMap: TypeComplexityMap) =>
  complexityMap
    .take(5)
    .forEach(printTypeComplexity)

const safeReadFile = (filename: string): string => {
  try {
    return fs.readFileSync(filename).toString()
  } catch (e) {
    console.error(String(e))
    process.exit(1)
    return ''
  }
}

function start (argv: Object) {
  // console.log('start', argv)

  const source = safeReadFile(argv.filename)

  if (argv.showTime) console.time('time')

  calculateSourceTypeComplexity(source)
    .map(argv.showAll
      ? printAllComplexities
      : print5Complexities)
    .mapL(printErrors)

  if (argv.showTime) console.timeEnd('time')
}

const DESC = [
  'Calculates complexity of each type alias in file.',
  'By default, only 5 types with the greatest complexity are showing.',
  'To see complexity of all types, use option -a (or --show-all).'
].join(EOL)

yargs
  .command('$0 <filename>', DESC, yargs =>
    yargs
      .positional('filename', {
        describe: 'path to file with flow typings',
        type: 'string'
      })
      .example('$0', 'types/index.js')
      .example('$0', 'myproject/src/index.js.flow')
      .example('$0', 'script.js'),
    start)
  .option('a', {
    alias: 'show-all',
    type: 'boolean',
    describe: 'Print complexity of all type aliases'
  })
  .option('t', {
    alias: 'show-time',
    type: 'boolean'
  })
  .help('h')
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .parse()
