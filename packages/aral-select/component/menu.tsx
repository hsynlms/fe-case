import type {
  JSX,
  ReactNode,
  RefCallback
} from 'react'
import { useState, useContext } from 'react'

import type { MenuProps } from '../types'

import { MenuBase } from './menu-base'
import { Item } from './item'
import { NoItemsMessage } from './no-items-message'

import { isFn } from '../utils'

import { useIsomorphicLayoutEffect } from '../helpers'

import { AralContext } from './context'

export function Menu({
  items, noItemsMessage, menuRef,
  menuElement, itemElement
}: MenuProps): JSX.Element {
  const {
    isMulti,
    disableHighlight,
    selectedItems,
    focusedItemValue,
    searchValue,
    blockItemHover,
    setBlockItemHover,
    getItemText,
    getItemValue,
    isItemDisabled,
    setFocusedItemValue,
    addItemToSelectedList,
    removeItemFromSelectedList
  } = useContext(AralContext)

  const [
    allowScrollingFocusedItem,
    setAllowScrollingFocusedItem
  ] = useState<boolean>(true)

  let activeItemRef: HTMLElement | null = null
  const getActiveItemRef: RefCallback<HTMLElement> = ref => {
    activeItemRef = ref
  }

  const MenuElement = menuElement ?? MenuBase
  const ItemElement = itemElement ?? Item

  let noItemsMessageEl: ReactNode

  if (isFn(noItemsMessage)) {
    noItemsMessageEl = noItemsMessage({ inputValue: searchValue.value })
  } else if (typeof noItemsMessage === 'string') {
    noItemsMessageEl = (<NoItemsMessage message={noItemsMessage} />)
  } else {
    noItemsMessageEl = noItemsMessage
  }

  useIsomorphicLayoutEffect(function setFocusedItemScrollingFlag() {
    if (allowScrollingFocusedItem && activeItemRef !== null) {
      activeItemRef.scrollIntoView({
        behavior: 'instant',
        block: 'nearest'
      })
    }

    setAllowScrollingFocusedItem(true)
  }, [focusedItemValue])

  return (
    <MenuElement menuRef={menuRef}>
      <div
        role={'listbox'}
        aria-multiselectable={isMulti}
        onMouseMove={() => setBlockItemHover(false)}
        onMouseDown={event => {
          event.stopPropagation()
          event.preventDefault()
        }}
      >
        {items.length === 0 && noItemsMessageEl}

        {items.map(item => {
          const text = getItemText(item)
          const value = getItemValue(item)
          const isDisabled = isItemDisabled(item)
          const isSelected = !!selectedItems.find(x => x.value === value)
          const isFocused = focusedItemValue === value
          const highlight = disableHighlight ? '' : searchValue.value

          const onHover = () => {
            if (blockItemHover || isFocused) return

            setAllowScrollingFocusedItem(false)
            setFocusedItemValue(value)
          }

          return (
            <ItemElement
              key={`item-${value}`}
              ref={isFocused ? getActiveItemRef : undefined}
              text={text}
              value={value}
              item={item}
              isDisabled={isDisabled}
              isSelected={isSelected}
              isFocused={isFocused}
              highlight={highlight}
              select={() => addItemToSelectedList(item)}
              deselect={() => removeItemFromSelectedList(item)}
              onHover={onHover}
            />
          )
        })}
      </div>
    </MenuElement>
  )
}
