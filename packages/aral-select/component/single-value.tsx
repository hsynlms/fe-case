import type { JSX } from 'react'
import { useContext } from 'react'

import type { SingleValueProps } from '../types'

import { cls } from '../utils'

import { AralContext } from './context'

import styles from './styles.module.scss'

export function SingleValue({ item }: SingleValueProps): JSX.Element {
  const { searchValue, debugLog } = useContext(AralContext)

  if (searchValue.value) {
    debugLog(`INFO - search input is not empty so the single value is about to hide: ${item.text}`)

    return (<></>)
  }

  return (
    <div
      key={`selected-single-${item.text}-${item.value}`}
      className={cls(styles['control-single-value'])}
    >
      {item.text}
    </div>
  )
}
