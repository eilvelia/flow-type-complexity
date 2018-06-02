// @flow

/**
 * Either `Left` or `Right`
 *
 * @interface Apropos
 * @template L
 * @template R
 */
declare export class Apropos<L, R> {
  // +typeclass: typeof Apropos,
  map<R1>(fn: (x: R) => R1): Apropos<L, R1>,
  mapR<R1>(fn: (x: R) => R1): Apropos<L, R1>,
  mapL<L1>(fn: (x: L) => L1): Apropos<L1, R>,
  bimap<L1, R1>(l: (x: L) => L1, r: (x: R) => R1): Apropos<L1, R1>,


  tap(fn: (x: R) => any): Apropos<L, R>,
  tapR(fn: (x: R) => any): Apropos<L, R>,
  tapL(fn: (x: L) => any): Apropos<L, R>,
  bitap(l: (x: L) => any, r: (x: R) => any): Apropos<L, R>,


  chain<L1, R1>(fn: (x: R) => Apropos<L1, R1>): Apropos<L | L1, R1>,
  chainR<L1, R1>(fn: (x: R) => Apropos<L1, R1>): Apropos<L | L1, R1>,
  chainL<L1, R1>(fn: (x: L) => Apropos<L1, R1>): Apropos<L1, R | R1>,
  bichain<L1, L2, R1, R2>(
    l: (x: L) => Apropos<L2, R2>,
    r: (x: R) => Apropos<L1, R1>
  ): Apropos<L1 | L2, R1 | R2>,


  cond(fn: (x: R) => boolean): boolean,
  chainCond<L1, R1>(
    cond: (x: R) => boolean,
    pass: (x: R) => R1,
    fail: (x: R) => L1
  ): Apropos<L | L1, R1>,
  logic<L1, R1>({
    cond: (x: R) => boolean,
    pass: (x: R) => R1,
    fail: (x: R) => L1
  }): Apropos<L | L1, R1>,


  alt<L1, R1>(e: Apropos<L1, R1>): Apropos<L1, R | R1>,
  or<L1, R1>(e: Apropos<L1, R1>): Apropos<L1, R | R1>,
  and<L1, R1>(e: Apropos<L1, R1>): Apropos<L | L1, R1>,
  ap<L1, R1>(e: Apropos<L1, ((x: R) => R1)>): Apropos<L | L1, R1>,


  thru<L1, R1>(fn: (x: Apropos<L, R>) => Apropos<L1, R1>): Apropos<L1, R1>,
  orElse(value: R): R,
  swap(): Apropos<R, L>,

  /**
   * Converts Apropos to Promise, which resolves with right value or rejects with left
   *
   * @returns {Promise<R>}
   */
  promise(): Promise<R>,
  fold<O>(l: (x: L) => O, r: (x: R) => O): O,


  isRight(): boolean,
  isLeft(): boolean,

  equals(value: any): boolean,
}

declare class AnnotatedError<-Tag = '', -Context = mixed> extends Error {
  -tag: Tag,
  -data: Context,
}

export type MakeError<-Tag = ''> = <-Context>(data: Context) => AnnotatedError<Tag, Context>


/**
 * Create fabric for generating tagged error constructors
 *
 * Useful in `.mapL`
 *
 * @function makeError
 * @template Tag
 * @param {(Tag|String)} tag
 */
declare export function makeError<-Tag>(tag: Tag): MakeError<Tag>
/**
 * Create right-handed value.
 *
 * Left-handed type is inferred from usage
 *
 * @template R
 * @template L
 * @param {R} value
 * @returns {Apropos<L, R>}
 */
declare export function Right</*::-*/L, R>(value: R): Apropos<L, R>

/**
 * Create left-handed value.
 *
 * Right-handed type is inferred from usage
 *
 * @template R
 * @template L
 * @param {L} value
 * @returns {Apropos<L, R>}
 */
declare export function Left<L, /*::-*/R>(value: L): Apropos<L, R>

/**
 * Create pure right-handed value
 *
 * Left-handed type is empty
 *
 * @template R
 * @param {R} value
 * @returns {Apropos<void, R>}
 */
declare export function of<R>(value: R): Apropos<void, R>

/**
 * Create pure left-handed value
 *
 * Right-handed type is empty
 *
 * @template L
 * @param {L} value
 * @returns {Apropos<L, void>}
 */
declare export function ofL<L>(value: L): Apropos<L, void>


/**
 * Checks whether an object is an instance of `Apropos`
 *
 * @template T
 * @param {T} value
 * @returns {boolean}
 */
declare export function is</*::-*/T>(value: T): boolean

/**
 * Either `Left` or `Right`
 *
 * @interface Either
 * @template L
 * @template R
 */
declare export class Either<L, R> {
  map<R1>(fn: (x: R) => R1): Either<L, R1>,
  mapR<R1>(fn: (x: R) => R1): Either<L, R1>,
  mapL<L1>(fn: (x: L) => L1): Either<L1, R>,
  bimap<L1, R1>(l: (x: L) => L1, r: (x: R) => R1): Either<L1, R1>,


  tap(fn: (x: R) => any): Either<L, R>,
  tapR(fn: (x: R) => any): Either<L, R>,
  tapL(fn: (x: L) => any): Either<L, R>,
  bitap(l: (x: L) => any, r: (x: R) => any): Either<L, R>,


  chain<L1, R1>(fn: (x: R) => Either<L1, R1>): Either<L | L1, R1>,
  chainR<L1, R1>(fn: (x: R) => Either<L1, R1>): Either<L | L1, R1>,
  chainL<L1, R1>(fn: (x: L) => Either<L1, R1>): Either<L1, R | R1>,
  bichain<L1, L2, R1, R2>(
    l: (x: L) => Either<L2, R2>,
    r: (x: R) => Either<L1, R1>
  ): Either<L1 | L2, R1 | R2>,


  cond(fn: (x: R) => boolean): boolean,
  chainCond<L1, R1>(
    cond: (x: R) => boolean,
    pass: (x: R) => R1,
    fail: (x: R) => L1
  ): Either<L | L1, R1>,
  logic<L1, R1>({
    cond: (x: R) => boolean,
    pass: (x: R) => R1,
    fail: (x: R) => L1
  }): Either<L | L1, R1>,


  alt<L1, R1>(e: Either<L1, R1>): Either<L1, R | R1>,
  or<L1, R1>(e: Either<L1, R1>): Either<L1, R | R1>,
  and<L1, R1>(e: Either<L1, R1>): Either<L | L1, R1>,
  ap<L1, R1>(e: Either<L1, ((x: R) => R1)>): Either<L | L1, R1>,


  thru<L1, R1>(fn: (x: Either<L, R>) => Either<L1, R1>): Either<L1, R1>,
  orElse(value: R): R,
  swap(): Either<R, L>,

  /**
   * Converts Either to Promise, which resolves with right value or rejects with left
   *
   * @returns {Promise<R>}
   */
  promise(): Promise<R>,
  fold<O>(l: (x: L) => O, r: (x: R) => O): O,


  isRight(): boolean,
  isLeft(): boolean,

  equals(value: any): boolean,

  static Right</*::-*/L, R>(value: R): Either<L, R>,
  static Left<L, /*::-*/R>(value: L): Either<L, R>,
  static of<R>(value: R): Either<void, R>,
  static ofL<L>(value: L): Either<L, void>,
  static is</*::-*/T>(value: T): boolean,
}

declare export class Maybe<T> {
  map<Tʹ>(fn: (x: T) => Tʹ): Maybe<Tʹ>,
  chain<Tʹ>(fn: (x: T) => Maybe<Tʹ>): Maybe<Tʹ>,
  tap(fn: (x: T) => any): Maybe<T>,
  fold<O>(l: () => O, r: (x: T) => O): O,
  orElse(x: T): T,

  alt<S>(maybe: Maybe<S>): Maybe<T | S>,
  both<S>(maybe: Maybe<S>): Maybe<[T, S]>,
  and<S>(maybe: Maybe<S>): Maybe<S>,

  match<J, N>({
    Just: (x: T) => J,
    Nothing: () => N,
  }): J | N,

  chainCond<Tʹ>(
    cond: (x: T) => boolean,
    pass: (x: T) => Tʹ
  ): Maybe<Tʹ>,
  logic<Tʹ>({
    cond: (x: T) => boolean,
    pass: (x: T) => Tʹ
  }): Maybe<Tʹ>,
  pred(check: (x: T) => boolean): Maybe<T>,

  promise(): Promise<T>,
  equals(value: any): boolean,
  isJust(): boolean,
  isNothing(): boolean,

  static Just<Tʹ>(value: Tʹ): Maybe<Tʹ>,
  static of<Tʹ>(value: Tʹ): Maybe<Tʹ>,
  static fromNullable<Tʹ>(value: ?Tʹ): Maybe<Tʹ>,
  static Nothing<+Tʹ>(): Maybe<Tʹ>,
  static empty<+Tʹ>(): Maybe<Tʹ>,
}

declare export class Identity<T> {
  map<O>(f: (x: T) => O): Identity<O>,
  chain<Name, O>(fn: (x: T) => Identity<O>): Identity<O>,
  get(): T,
  equals(value: any): boolean,
  fold<O>(fn: (x: T) => O): O,

  static empty(): Identity<void>,
  static is(identity: mixed): boolean,
  static of<Tʹ>(value: Tʹ): Identity<Tʹ>,
}

declare export class Tuple<A, B> {
  fst(): A,
  snd(): B,
  bimap<Aʹ, Bʹ>(f: (a: A) => Aʹ, g: (b: B) => Bʹ): Tuple<Aʹ, Bʹ>,
  map<Bʹ>(f: (b: B) => Bʹ): Tuple<A, Bʹ>,
  curry<X>(f: (x: Tuple<A, B>) => X): X,
  uncurry<X>(f: (a: A, b: B) => X): X,
  extend<N>(f: (x: Tuple<A, B>) => N): Tuple<A, N>,
  extract(): B,
  foldl<X, Z>(f: (b: B, z: Z) => X, z: Z): X,
  foldr<X, Z>(f: (z: Z, b: B) => X, z: Z): X,
  equals<Aʹ, Bʹ>(tuple: Tuple<Aʹ, Bʹ>): boolean,

  static of<Aʹ, Bʹ>(a: Aʹ, b: Bʹ): Tuple<Aʹ, Bʹ>,
  static fst<Aʹ, Bʹ>(tuple: Tuple<Aʹ, Bʹ>): Aʹ,
  static snd<Aʹ, Bʹ>(tuple: Tuple<Aʹ, Bʹ>): Bʹ,
}
