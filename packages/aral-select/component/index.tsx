'use client'

import type {
  JSX,
  ReactNode,
  KeyboardEvent,
  MouseEvent,
  RefCallback
} from 'react'
import {
  useRef,
  useState,
  useEffect,
  useCallback
} from 'react'

import type {
  AralProps,
  AralItem,
  AralSelectedItem,
  SearchValue,
  MenuState,
  ControlProps
} from '../types'

import { Menu } from './menu'
import { Control } from './control'
import { HiddenInputs } from './hidden-inputs'
import { SingleValue } from './single-value'
import { MultiValues } from './multi-values'
import { Loading } from './loading'
import { ArrowDown } from './arrow-down'

import {
  cls,
  isFn,
  getItemTextBase,
  getItemValueBase,
  isItemDisabledBase,
  escapeRegExp
} from '../utils'

import { useIsomorphicLayoutEffect } from '../helpers'

import { AralContext } from './context'

import styles from './styles.module.scss'

export function AralSelect({
  id, name,
  defaultValue,
  items = [],
  required = false,
  placeholder = 'Select...',
  isDisabled = false,
  isMulti = false,
  isLoading = false,
  disableHighlight = false,
  enableDebugMode = false,
  hideSelectedItems = false,
  closeMenuOnSelect = true,
  isMenuOpen = false,
  inputProps,
  noItemsMessage = 'No items',
  loadItems,
  loadingElement,
  menuElement,
  itemElement,
  getItemText = getItemTextBase,
  getItemValue = getItemValueBase,
  isItemDisabled = isItemDisabledBase
}: AralProps): JSX.Element {
  const searchInputRef = useRef<HTMLInputElement>(null)

  let menuRef: HTMLElement | null = null
  const getMenuRef: RefCallback<HTMLElement> = ref => {
    menuRef = ref
  }

  const lastRequest = useRef<unknown>(null)

  const [ menuItems, setMenuItems ] = useState<AralItem[]>(items)
  const [ selectedItems, setSelectedItems ] = useState<AralSelectedItem[]>([])
  const [ isSelectLoading, setSelectLoading ] = useState<boolean>(isLoading)
  const [ searchValue, setSearchValue ] = useState<SearchValue>({ value: '', displayMenu: false })
  const [ showMenu, setShowMenu ] = useState<boolean>(isMenuOpen)
  const [ firstRender, setFirstRender ] = useState<boolean>(true)
  const [ focusedItemValue, setFocusedItemValue ] = useState<string>('')
  const [ focusedControlItemValue, setFocusedControlItemValue ] = useState<string>('')
  const [ blockItemHover, setBlockItemHover ] = useState<boolean>(false)

  const debugLog = (...messages: unknown[]) => {
    enableDebugMode && console.log(...messages)
  }

  const changeMenuState = (state: MenuState) => {
    setFocusedControlItemValue('')

    if (isMenuOpen) return

    setShowMenu(state === 'open')

    if (state === 'close') {
      menuRef?.scrollTo({
        top: 0,
        behavior: 'instant'
      })
    }
  }

  const onSearchInputValueChange = async (value: string) => {
    debugLog(`INFO - search input value is changed: ${value}`)

    if (!value) lastRequest.current = null

    const request = (lastRequest.current = {})

    // fallback: filter initial items by search input value
    let newItems = items

    if (value && isFn(loadItems)) {
      debugLog('INFO - new menu items are being loaded: `loadItems`')

      setSelectLoading(true)

      debugLog('INFO - select state is set to `loading`')

      try {
        newItems = await loadItems(value) ?? []
      } catch (err: any) {
        debugLog(`ERR - new menu items loading threw an error. check the \`loadItems\` function`, err)
      }

      setSelectLoading(false)

      debugLog('INFO - select state is reset')
      debugLog(`INFO - ${newItems.length} new menu items are loaded and are going to be rendered: \`loadItems\``)

      if (request !== lastRequest.current) return

      lastRequest.current = null
    }

    if (value) {
      const regexp = new RegExp(escapeRegExp(value), 'i')

      newItems = newItems.filter(x => regexp.test(getItemText(x)))
    }

    newItems = newItems.filter(item => {
      return hideSelectedItems
        ? !selectedItems.find(x => x.value === getItemValue(item))
        : true
    })

    // prevent re-render if the previous item values are
    // same with the new item values
    const prevMenuItemValues = menuItems.map(getItemValue).join()
    const nextMenuItemValues = newItems.map(getItemValue).join()

    if (prevMenuItemValues !== nextMenuItemValues) {
      setMenuItems(newItems)
    }

    // set the first item focused instead none

    const focusedItemIndex = newItems.map(getItemValue).indexOf(focusedItemValue)

    // new list already contain the focused item value
    // no need to change it
    if (focusedItemIndex >= 0) return

    let valueToBeFocused = ''

    const firstItem = newItems[0]

    if (firstItem) {
      valueToBeFocused = getItemValue(firstItem)
    }

    setFocusedItemValue(valueToBeFocused)

    searchValue.displayMenu && changeMenuState('open')
  }

  const addItemToSelectedList = (item: AralItem) => {
    const text = getItemText(item)
    const value = getItemValue(item)
    const isDisabled = isItemDisabled(item)
    const isAlreadySelected = !!selectedItems.find(x => x.value === value)

    if (isDisabled) return

    debugLog('INFO - the menu is closing')

    closeMenuOnSelect && changeMenuState('close')

    setSearchValue({ value: '', displayMenu: false })

    debugLog('INFO - search input value is reset')

    isMulti && focusSearchInput()

    // if the item is already selected
    // remove it from the selected items list
    if (isAlreadySelected) {
      debugLog(`INFO - the menu item is already selected. so it's removed from the selected list: ${text}`)

      return removeItemFromSelectedList(item)
    }

    debugLog(`INFO - the menu item is selected: ${text}`)

    setSelectedItems((prev: AralSelectedItem[]) => {
      return [
        ...(isMulti ? prev : []),
        { text, value }
      ]
    })
  }

  const removeItemFromSelectedList = (item: AralItem | AralSelectedItem, clearInputAndFocus = true) => {
    const text = getItemText(item) ?? (item as AralSelectedItem).text
    const value = getItemValue(item) ?? (item as AralSelectedItem).value
    const isNotSelected = !selectedItems.find(x => x.value === value)

    setFocusedControlItemValue('')

    if (isNotSelected) return

    if (clearInputAndFocus) {
      setSearchValue({ value: '', displayMenu: false })

      debugLog('INFO - search input value is reset')

      isMulti && focusSearchInput()
    }

    debugLog(`INFO - the menu item is removed: ${text}`)

    setSelectedItems((prev: AralSelectedItem[]) => {
      return [...prev.filter(x => x.value !== value)]
    })
  }

  const onInputBlur = useCallback(() => {
    if (searchInputRef.current !== document.activeElement) {
      changeMenuState('close')
    }
  }, [])

  const onControlKeyDown = useCallback<ControlProps['onInputKeyDown']>(
    (event: KeyboardEvent<HTMLElement>) => {
      const focusedItemIndex = menuItems
        .map(getItemValue)
        .indexOf(focusedItemValue)

      const focusedControlItemIndex = selectedItems
        .map(x => x.value)
        .indexOf(focusedControlItemValue)

      switch(event.code) {
        case 'Escape': {
          debugLog('INFO - the menu is about to hide due to escape key press')

          changeMenuState('close')

          break
        }
        case 'Backspace': {
          // if the search input is not empty
          // or the selected item list is empty
          // there is nothing to remove
          if (searchValue.value || selectedItems.length === 0) return

          if (focusedControlItemIndex >= 0) {
            const focusedControlItem = selectedItems[focusedControlItemIndex] as AralSelectedItem

            debugLog(`INFO - the selected item is removed by backspace key: #${focusedControlItemIndex} -> ${focusedControlItem.value}`)

            return removeItemFromSelectedList(focusedControlItem, false)
          }

          const lastItem = selectedItems[selectedItems.length - 1] as AralSelectedItem

          debugLog(`INFO - the last selected item is removed by backspace key: #${selectedItems.length - 1} -> ${lastItem.value}`)

          removeItemFromSelectedList(lastItem, false)

          break
        }
        case 'ArrowDown':
        case 'ArrowUp': {
          // arrow up and down keys may cause
          // blinking caret position change
          event.preventDefault()

          // reset focused control item value to prevent any selection
          setFocusedControlItemValue('')

          setBlockItemHover(true)

          let valueToBeFocused = ''

          const firstItem = menuItems[0]

          // the list does not have the focused item value
          // mark the first item as focused if it does exist
          if (focusedItemIndex < 0) {
            valueToBeFocused = firstItem ? getItemValue(firstItem) : ''
          }

          if (focusedItemIndex >= 0 && event.code === 'ArrowDown') {
            const nextItem = menuItems[focusedItemIndex + 1]

            if (nextItem) {
              valueToBeFocused = getItemValue(nextItem)
            } else {
              // reached bottom. return to the top of the list
              valueToBeFocused = getItemValue(firstItem as AralItem)
            }

            debugLog(`INFO - the menu item is focused by arrow down key: #${focusedItemIndex} -> ${focusedItemValue}`)
          } else if (focusedItemIndex >= 0) {
            const prevItem = menuItems[focusedItemIndex - 1]

            if (focusedItemIndex === 0) {
              // reached top. return to the bottom of the list
              valueToBeFocused = getItemValue(menuItems[menuItems.length - 1] as AralItem)
            } else {
              valueToBeFocused = getItemValue(prevItem as AralItem)
            }

            debugLog(`INFO - the menu item is focused by arrow up key: #${focusedItemIndex} -> ${focusedItemValue}`)
          }

          setFocusedItemValue(valueToBeFocused)

          // if the menu is closed show it now
          changeMenuState('open')

          break
        }
        case 'ArrowLeft':
        case 'ArrowRight': {
          if (selectedItems.length === 0) return
          if (searchValue.value.length > 0) return

          // no item to be focused
          if (event.code === 'ArrowRight' && focusedControlItemValue === '') return

          // reset focused menu item value to prevent any selection
          setFocusedItemValue('')

          const lastItem = selectedItems[selectedItems.length - 1] as AralSelectedItem

          if (event.code === 'ArrowRight' && lastItem.value === focusedControlItemValue) {
            return setFocusedControlItemValue('')
          }

          let valueToBeFocused = focusedControlItemValue

          // the list does not have the focused item value
          if (focusedControlItemIndex < 0) {
            valueToBeFocused = lastItem.value
          }

          if (focusedControlItemIndex >= 0 && event.code === 'ArrowRight') {
            const nextItem = selectedItems[focusedControlItemIndex + 1]
            if (nextItem) valueToBeFocused = nextItem.value as string

            debugLog(`INFO - the selected item is focused by arrow right key: #${focusedControlItemIndex} -> ${focusedControlItemValue}`)
          } else if (focusedControlItemIndex >= 0) {
            const prevItem = selectedItems[focusedControlItemIndex - 1]

            if (focusedControlItemIndex !== 0) {
              valueToBeFocused = prevItem?.value as string
            }

            debugLog(`INFO - the selected item is focused by arrow left key: #${focusedControlItemIndex} -> ${focusedControlItemValue}`)
          }

          setFocusedControlItemValue(valueToBeFocused)

          break
        }
        case 'Enter':
        case 'Space':
        case 'Tab': {
          // the search input is not empty and the space key is pressed
          // means s/he is still typing so skip the focused item selection
          if (event.code === 'Space' && searchValue.value) return

          // if there is no focused item to be selected
          if (focusedItemIndex < 0) return

          event.preventDefault()

          addItemToSelectedList(menuItems[focusedItemIndex] as AralItem)

          break
        }
        default:
          // s/he is typing, set the input opacity to 1
          setFocusedControlItemValue('')

          break
      }
    },
    [
      menuItems, selectedItems, searchValue.value,
      focusedItemValue, focusedControlItemValue
    ]
  )

  const onControlMouseDown = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()

    focusSearchInput()
    changeMenuState(showMenu ? 'close' : 'open')
  }

  const focusSearchInput = () => {
    if (searchInputRef.current !== document.activeElement) {
      searchInputRef.current?.focus()

      debugLog('INFO - search input is focused')
    }
  }

  useEffect(function setInitials() {
    debugLog('INFO - initial select values are being set')

    let initials: AralItem[] = []

    if (defaultValue) {
      initials = Array.isArray(defaultValue)
        ? [...defaultValue]
        : [defaultValue]
    }

    if (initials.length === 0) return

    const selectedItems: AralSelectedItem[] = initials.map(x => ({
      text: getItemText(x),
      value: getItemValue(x)
    }))

    const menuItemValues = menuItems.map(getItemValue)

    // provided default values must be in provided item list
    setSelectedItems(selectedItems.filter(x => menuItemValues.includes(x.value)))

    debugLog('INFO - initial select values are set')
  }, [])

  useEffect(function isFirstRender() {
    setFirstRender(false)
  }, [firstRender])

  useEffect(function handleSearchValueChange() {
    // at first render do not show the menu component
    firstRender === false && onSearchInputValueChange(searchValue.value)
  }, [searchValue.value])

  useIsomorphicLayoutEffect(function handleClickOutside() {
    const onBlur = (event: FocusEvent) => {
      if (event.target === window) changeMenuState('close')
    }

    window.addEventListener('blur', onBlur, true)

    return () => {
      window.removeEventListener('blur', onBlur, true)
    }
  }, [])

  const selectedItemValues = selectedItems.length > 0
    ? isMulti
      ? <MultiValues items={selectedItems} focusedValue={focusedControlItemValue} />
      : <SingleValue item={selectedItems[0] as AralSelectedItem} />
    : null

  let loadingEl: ReactNode

  if (!loadingElement) {
    loadingEl = (<Loading />)
  } else if (isFn(loadingElement)) {
    loadingEl = loadingElement({ inputValue: searchValue.value })
  } else {
    loadingEl = loadingElement
  }

  return (
    <AralContext.Provider
      value={{
        isMulti,
        disableHighlight,
        selectedItems,
        showMenu,
        focusedItemValue,
        focusedControlItemValue,
        searchValue,
        blockItemHover,
        setBlockItemHover,
        setFocusedItemValue,
        setSearchValue,
        getItemText,
        getItemValue,
        isItemDisabled,
        addItemToSelectedList,
        removeItemFromSelectedList,
        debugLog
      }}
    >
      <div id={id} className={cls(styles['aral'])}>
        <div
          className={cls([
            styles['control'],
            isDisabled && styles['control-disabled']
          ])}
          onMouseDown={onControlMouseDown}
        >
          <div
            className={cls(
              isMulti && selectedItems.length > 0
                ? styles['control-input-multi']
                : styles['control-input']
            )}
          >
            <Control
              ref={searchInputRef}
              placeholder={placeholder}
              required={required}
              inputProps={inputProps}
              onInputKeyDown={onControlKeyDown}
              onInputBlur={onInputBlur}
            >
              {selectedItemValues}
            </Control>
          </div>

          <div
            className={cls(styles['control-indicator'])}
            aria-hidden={true}
          >
            {isSelectLoading && loadingEl}

            <span className={cls(styles['control-indicator-arrow'])}>
              <ArrowDown />
            </span>
          </div>
        </div>

        {showMenu && (
          <Menu
            menuRef={getMenuRef}
            items={menuItems}
            noItemsMessage={noItemsMessage}
            menuElement={menuElement}
            itemElement={itemElement}
          />
        )}

        <HiddenInputs name={name} items={selectedItems} />
      </div>
    </AralContext.Provider>
  )
}
