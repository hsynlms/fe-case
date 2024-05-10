import type { JSX } from 'react'

import type { NoItemsMessageProps } from '../types'

import { cls } from '../utils'

import styles from './styles.module.scss'

export function NoItemsMessage({ message }: NoItemsMessageProps): JSX.Element {
  return (
    <div className={cls(styles['no-items'])}>
      {message}
    </div>
  )
}
