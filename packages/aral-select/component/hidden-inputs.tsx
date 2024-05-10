import type { JSX } from 'react'
import { memo } from 'react'

import type { AralHiddenInputsProps } from '../types'

function Component({ name, items }: AralHiddenInputsProps): JSX.Element {
  return (
    <div>
      {items.map(({ value }) => (
        <input
          key={`${name}-${value}`}
          type={'hidden'}
          name={name}
          value={value}
        />
      ))}
    </div>
  )
}

export const HiddenInputs = memo<AralHiddenInputsProps>(
  Component,
  // skip component re-rendering
  // if the `name` prop and the `values` are same
  (prevProps, nextProps) => {
    const oldValues = prevProps.items.map(x => x.value).join()
    const newValues = nextProps.items.map(x => x.value).join()

    const areNamesEqual = prevProps.name === nextProps.name
    const areValuesEqual = oldValues === newValues

    return areNamesEqual && areValuesEqual
  }
)
