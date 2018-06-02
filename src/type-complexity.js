// @flow

import { find, mergeWith, pipe, map, sum, tail, length/*, tap*/ } from 'ramda'
import { parse } from 'flow-parser'
//import { parse } from 'babylon'
import { Maybe, Either } from 'apropos'
import { Set as ImmutableSet, OrderedMap } from 'immutable'
import memoizee from 'memoizee'
// import { printAST } from './util'
import { deepFindAll } from './util/deep-find'

import type {
  Program, ParsingError, TypeAlias,
  FlowTypeAnnotation, GenericTypeAnnotation, UnionTypeAnnotation
} from '../types/ast'

const { Left, Right } = Either

export type ErrorMessage = string
export type TypeAliasName = string
export type TypeComplexity = { unions: number, primitives: number }
export type TypeComplexityMap = OrderedMap<TypeAliasName, TypeComplexity>
// export type TypeComplexityMap = Map<TypeAliasName, TypeComplexity>

const makeErrorMessage = (err: ParsingError) =>
  `Error: ${err.message} (${err.loc.start.line}:${err.loc.start.column})`

const makeAST = (source: string): Either<ErrorMessage[], Program> => {
  const ast = parse(source, {})
  // , { plugins: ['flow', 'flowComments'] })
  return ast.errors.length > 0
    ? Left(ast.errors
        .map(makeErrorMessage))
    : Right(ast)
}

const primitiveTypeAnnotations = [
  'NumberLiteralTypeAnnotation',
  'NumberTypeAnnotation',
  'StringLiteralTypeAnnotation',
  'StringTypeAnnotation',
  'BooleanLiteralTypeAnnotation',
  'BooleanTypeAnnotation',
  'VoidTypeAnnotation',
  'NullLiteralTypeAnnotation',
  'MixedTypeAnnotation',
  'AnyTypeAnnotation'
]

const findAllTypeAliases = (ast: Program): TypeAlias[] =>
  deepFindAll(e => e.type === 'TypeAlias', ast.body)

const findAllPrimitives = (type: TypeAlias): FlowTypeAnnotation[] =>
  deepFindAll(e => primitiveTypeAnnotations.includes(e.type), type)

const findAllUnions = (type: TypeAlias): UnionTypeAnnotation[] =>
  deepFindAll(e => e.type === 'UnionTypeAnnotation', type)

const findAllGenericTypes = (type: TypeAlias): GenericTypeAnnotation[] =>
  deepFindAll(e => e.type === 'GenericTypeAnnotation', type)

const findTypeAlias =
  (typeAliases: TypeAlias[]) =>
  (genericType: GenericTypeAnnotation): Maybe<TypeAlias> =>
    Maybe.fromNullable(
      find(typeAlias => typeAlias.id.name === genericType.id.name, typeAliases))

const getDefaultTypeComplexity = (): TypeComplexity =>
  ({ unions: 0, primitives: 0 })

const sum2 = (x: number, y: number) => x + y

type MergeTypeComplexity =
  & ((TypeComplexity, TypeComplexity) => TypeComplexity)
  & ((TypeComplexity, ...rest: void[]) => TypeComplexity => TypeComplexity)
const mergeTypeComplexity: MergeTypeComplexity = mergeWith(sum2)

const unionSum: (unions: UnionTypeAnnotation[]) => number =
  pipe(
    map(pipe(
      union => union.types,
      tail,
      length
    )),
    sum)

export const calculateTypeAliasComplexity = memoizee((
  type: TypeAlias,
  typeAliases: TypeAlias[],
  visited: ImmutableSet<TypeAlias>
): TypeComplexity => {
  const unionsCount = unionSum(findAllUnions(type))
  const primitivesCount = findAllPrimitives(type).length
  const typeComplexity = { unions: unionsCount, primitives: primitivesCount }
  // console.log('typeComplexity', typeComplexity)

  const genericTypes = findAllGenericTypes(type)
  // console.log('generic types', genericTypes)

  const newVisited = visited.add(type)

  return mergeTypeComplexity(
    typeComplexity,
    genericTypes
      .map(findTypeAlias(typeAliases))
      .map(maybe => maybe
        .pred(e => !newVisited.has(e))
        .map(type => calculateTypeAliasComplexity(type, typeAliases, newVisited))
        .fold(getDefaultTypeComplexity, x => x))
      .reduce(mergeTypeComplexity, getDefaultTypeComplexity())
  )
}, { length: 2 })

// const createMap = <K, V>(iterable: Iterable<[K, V]>): Map<K, V> =>
  // new Map(iterable)

export const calculateSourceTypeComplexity = (
  source: string
): Either<ErrorMessage[], TypeComplexityMap> =>
  makeAST(source)
    .map(pipe(
      findAllTypeAliases,
      // tap(printAST),
      types =>
        types.map(type => [
          type.id.name,
          calculateTypeAliasComplexity(type, types, ImmutableSet())
        ]),
      OrderedMap,
      orderedMap => orderedMap
        .sortBy(t => t.primitives)
        .reverse()
    ))
