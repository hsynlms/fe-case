import type { JSX, MouseEvent } from 'react'
import { useContext } from 'react'

import type { MultiValuesProps } from '../types'

import { cls } from '../utils'

import { AralContext } from './context'

import styles from './styles.module.scss'

export function MultiValues({ items, focusedValue = '' }: MultiValuesProps): JSX.Element {
  const { removeItemFromSelectedList, debugLog } = useContext(AralContext)

  return (
    <>
      {items.map(item => {
        const onMouseDown = (event: MouseEvent<HTMLElement>) => {
          // prevent the menu state change
          event.stopPropagation()
          event.preventDefault()

          debugLog(`INFO - the selected item is removed: ${item.text}`)

          removeItemFromSelectedList(item, false)
        }

        return (
          <div
            key={`selected-multi-${item.text}-${item.value}`}
            className={cls(styles['control-multi-values'])}
          >
            {item.text}

            <span
              role={'button'}
              className={cls([
                styles['control-multi-values-remove'],
                focusedValue === item.value && styles['control-multi-values-remove-focused']
              ])}
              onMouseDown={onMouseDown}
            />
          </div>
        )
      })}
    </>
  )
}
