import crypto from 'crypto'

// ========================================================

export const makeRandomID = (): string => crypto.randomBytes(8).toString('hex')

/**
 * Take a big object, and create a new object that only has
 * the fields provided in `fields`. Each field will be "picked"
 * from the bigger object, if it exists. If it doesn't exist,
 * it will be undefined in the new object.
 * Instead of a field key, you can instead pass a function
 * which will take the original object and must return
 * a temporary object, which will be merged into the new one.
 * Think of the function variant as what you'd pass to
 * array.map(), except there's no index parameter.
 *
 * Example:
 *  // Returns: { name: 'Dingus', age: 32, missing: undefined }
 *  pick(['name', 'age', 'missing'])({ name: 'Dingus', age: 32, weight: 230 })
 *
 * @param fields
 * @returns
 */
export type TPickerField = string | ((obj: any) => Record<string, any>)
export const pick = (fields: TPickerField[]) => (obj: any) =>
  fields.reduce((newObj, picker) => {
    if (typeof picker === 'function') {
      return { ...newObj, ...picker(obj) }
    }

    newObj[picker] = picker in obj ? obj[picker] : undefined
    return newObj
  }, {} as Record<string, any>)
