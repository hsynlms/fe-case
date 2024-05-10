import { createContext } from 'react'

import type { Context } from '../types'

export const AralContext = createContext<Context>({
  isMulti: false,
  disableHighlight: false,
  selectedItems: [],
  showMenu: false,
  focusedItemValue: '',
  focusedControlItemValue: '',
  searchValue: { value: '' },
  blockItemHover: false,
  setBlockItemHover: () => {},
  setFocusedItemValue: () => {},
  setSearchValue: () => {},
  getItemText: () => '',
  getItemValue: () => '',
  isItemDisabled: () => false,
  addItemToSelectedList: () => {},
  removeItemFromSelectedList: () => {},
  debugLog: () => {}
})
