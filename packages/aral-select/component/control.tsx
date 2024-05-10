import type {
  JSX,
  ReactNode,
  ChangeEvent
} from 'react'
import {
  useId,
  useContext,
  useCallback,
  forwardRef
} from 'react'

import type { ControlProps } from '../types'

import { cls, isFn } from '../utils'

import { AralContext } from './context'

import styles from './styles.module.scss'

export const Control = forwardRef<HTMLInputElement, ControlProps>(
  function Control({
    children, placeholder, required,
    inputProps, onInputKeyDown, onInputBlur
  }, ref): JSX.Element {
    const {
      showMenu,
      searchValue,
      selectedItems,
      focusedControlItemValue,
      setSearchValue
    } = useContext(AralContext)

    const placeholderId = useId()
    const showPlaceholder = (searchValue.value.length + selectedItems.length) === 0

    let placeholderEl: ReactNode

    if (isFn(placeholder)) {
      placeholderEl = placeholder()
    } else {
      placeholderEl = placeholder
    }

    const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      setSearchValue({
        value: event.target.value,
        displayMenu: true
      })
    }, [])

    return (
      <>
        {children}

        {showPlaceholder && (
          <div
            id={placeholderId}
            className={cls(styles['control-input-placeholder'])}
          >
            {placeholderEl}
          </div>
        )}

        <div
          className={cls([
            styles['search'],
            focusedControlItemValue && styles['search-hide']
          ])}
          data-value={searchValue.value}
        >
          <input
            type={'text'}
            tabIndex={0}
            autoCapitalize={'none'}
            autoComplete={'off'}
            autoCorrect={'off'}
            spellCheck={false}
            aria-haspopup={true}
            aria-autocomplete={'list'}
            aria-expanded={showMenu}
            aria-describedby={placeholderId}
            role={'combobox'}
            {...inputProps}
            ref={ref}
            required={required}
            value={searchValue.value}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            onBlur={onInputBlur}
          />
        </div>
      </>
    )
  }
)
