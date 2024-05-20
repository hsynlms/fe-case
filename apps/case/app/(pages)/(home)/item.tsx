import type { JSX } from 'react'
import { forwardRef } from 'react'
import type { AralItemProps } from '@fe-case/aral-select'
import { highlightSearchTerm } from '@fe-case/aral-select'

import { cls } from '@utils'

import styles from './item.module.scss'

export const Item = forwardRef<HTMLInputElement, AralItemProps>(
  function Item({
    text, item, isDisabled, isSelected, isFocused,
    highlight, select, deselect, onHover
  }, ref): JSX.Element {
    const episodeCount = Number(item['episode']?.length ?? 0)

    return (
      <div
        ref={ref}
        className={cls([
          styles['item'],
          isDisabled && styles['item-disabled'],
          isSelected && styles['item-selected'],
          isFocused && styles['item-focused']
        ])}
        onMouseMove={onHover}
        onMouseOver={onHover}
        onClick={() => isSelected ? deselect() : select()}
      >
        <div className={styles['item-inner']}>
          <input type={'checkbox'} checked={isSelected} readOnly />

          <img
            src={item['image']}
            width={40} height={40}
            alt={text}
            className={styles['item-image']}
          />

          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: highlight
                  ? highlightSearchTerm(text, highlight)
                  : text
              }}
            />

            <div className={styles['item-episodes']}>
              {episodeCount} episode{episodeCount > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    )
  }
)
