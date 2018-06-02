// @flow

// import { pipe, chain, values } from 'ramda'

const isObject = (value: mixed): boolean %checks =>
  typeof value === 'object' && !!value

type Obj = { [key: string]: any }
type Arr = Array<any>
type FilterFn = (obj: $ReadOnly<{ [key: string]: mixed }>) => boolean

// export const deepFindAll = (filterFn: FilterFn, obj: Obj): Object[] =>
//   pipe(
//     values,
//     chain(e => {
//       if (!isObject(e)) return []
//       return filterFn(e)
//         ? [e]
//         : deepFindAll(filterFn, e)
//     })
//   )(obj)

// export const deepFindAll = (filterFn: FilterFn, obj: Obj | Arr): Object[] => {
//   const result = []
//
//   Object.values(obj)
//     .forEach((e: mixed) => {
//       if (!isObject(e)) return
//
//       if (filterFn(e))
//         result.push(e)
//
//       result.push(...deepFindAll(filterFn, e))
//     })
//
//   return result
// }

export const deepFindAll = (filterFn: FilterFn, obj: Obj | Arr): Object[] => {
  const result = []
  const objects = []

  Object.values(obj)
    .forEach(e => isObject(e)
      && objects.push(e))

  while (objects.length > 0) {
    const object = objects.pop()

    if (filterFn(object))
      result.push(object)

    Object.values(object)
      .forEach(e => isObject(e)
        && objects.push(e))
  }

  return result
}
