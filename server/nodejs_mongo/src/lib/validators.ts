type t_nil = null | undefined

export const isString = (str: any): str is string => {
  return typeof str === 'string'
}

export const isNil = (val: any): val is t_nil => {
  return typeof val === 'undefined' || val === null
}

export const stringIsLength = (
  str: any,
  minLength: number = 1
): str is string => isString(str) && str.trim().length >= minLength
