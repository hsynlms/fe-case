import type { JSX } from 'react'

import { cls } from '../utils'

import styles from './styles.module.scss'

export const Loading = (): JSX.Element => (<span className={cls(styles['loading'])} />)
