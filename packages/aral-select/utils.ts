import type { AralItem } from './types'

/**
 * The base method to get/parse the text of the `item`
*/
export const getItemTextBase = (item: AralItem): string => item['text']

/**
 * The base method to get/parse the value of the `item`
*/
export const getItemValueBase = (item: AralItem): string => String(item['value'])

/**
 * The base method to get/parse the disable state of the `item`
*/
export const isItemDisabledBase = (item: AralItem) => item['disabled'] === true

/**
 * The base method to highlight the search term in the given value
*/
export const highlightSearchTermBase = (text: string, searchTerm: string) => {
  const regexp = new RegExp(searchTerm, 'gi')
  const match = regexp.exec(escapeRegExp(text))

  if (match !== null) {
    const arr = text.split('')
    const replace = `<strong>${match[0]}</strong>`.split('')

    arr.splice(match.index, match[0].length, ...replace)

    return arr.join('')
  }

  return text
}

/**
 * Generate element class names
 */
export const cls = (input: string | Array<string | undefined> | undefined) => {
  if (!input) {
    return ''
  }

  if (typeof input === 'string') {
    return input
  } else {
    return input.filter(x => !!x).join(' ')
  }
}

/**
 * Escaping special characters in the given value
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
 */
export const escapeRegExp = (value: string) => {
  // $& means the whole matched string
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Check the given value if it's a function
 */
export const isFn = (value: unknown): value is Function => typeof value === 'function'
