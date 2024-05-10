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
