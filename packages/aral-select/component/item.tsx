import type { JSX } from 'react'
import { forwardRef } from 'react'

import type { AralItemProps } from '../types'

import { cls, highlightSearchTermBase } from '../utils'

import styles from './styles.module.scss'

export const Item = forwardRef<HTMLInputElement, AralItemProps>(
  function Item({
    text, isDisabled, isSelected, isFocused,
    highlight, select, deselect, onHover
  }, ref): JSX.Element {
    const onClick = () => {
      isSelected
        ? deselect()
        : select()
    }

    return (
      <div
        ref={ref}
        className={cls([
          styles['item'],
          isDisabled && styles['item-disabled'],
          isSelected && styles['item-selected'],
          isFocused && styles['item-focused']
        ])}
        tabIndex={-1}
        role={'option'}
        aria-disabled={isDisabled}
        aria-selected={isSelected}
        onClick={isDisabled ? undefined : onClick}
        onMouseMove={isDisabled ? undefined : onHover}
        onMouseOver={isDisabled ? undefined : onHover}
        dangerouslySetInnerHTML={{
          __html: highlight
            ? highlightSearchTermBase(text, highlight)
            : text
        }}
      />
    )
  }
)
