// @flow

import util from 'util'

// import type { Program } from '../types/ast'

export const printAST = (
  ast: Object | Array<any>,
  depth?: number
): void =>
  // console.log(JSON.stringify(ast, null, '  '))
  console.log(util.inspect(ast, {
    depth: depth || null,
    colors: true
  }))
