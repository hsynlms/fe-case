import type { JSX } from 'react'

import type { AralMenuProps } from '../types'

import { cls } from '../utils'

import styles from './styles.module.scss'

export function MenuBase({ children, menuRef, shouldHide }: AralMenuProps): JSX.Element {
  return (
    <div
      ref={menuRef}
      className={cls(styles['menu'])}
      style={{ display: shouldHide ? 'none' : '' }}
    >
      {children}
    </div>
  )
}
