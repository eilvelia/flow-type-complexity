// @flow

export type Options = {
  length?: number | false,
  maxAge?: number,
  max?: number,
  preFetch?: number | true,
  promise?: boolean,
  dispose?: (value: any) => void,
  async?: boolean,
  primitive?: boolean,
  normalizer?: (value: any) => void,
  resolvers?: Array<(arg: any) => any>
}

// export type Memoized<F> = {
//   delete: F,
//   clear: F & (() => void)
// }

declare export default function memoizee<F: Function>(
  f: F,
  options?: Options
): F // & Memoized<F>
