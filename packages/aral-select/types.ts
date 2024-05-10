import type {
  JSX,
  ReactNode,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  ComponentPropsWithoutRef,
  KeyboardEvent,
  FocusEvent,
  RefCallback
} from 'react'

type GetItemFunc<T> = (item: AralItem) => T;

export type MenuState = 'open' | 'close'

export type AralItem = {
  [key: string]: any;
}

export type AralSelectedItem = {
  text: string;
  value: string;
}

export type SearchValue = {
  value: string;
  displayMenu?: boolean;
}

export type Context = {
  isMulti: boolean;
  disableHighlight: boolean;
  selectedItems: AralSelectedItem[];
  showMenu: boolean;
  focusedItemValue: string;
  focusedControlItemValue: string;
  searchValue: SearchValue;
  blockItemHover: boolean;
  setBlockItemHover: Dispatch<SetStateAction<boolean>>;
  setFocusedItemValue: Dispatch<SetStateAction<string>>;
  setSearchValue: Dispatch<SetStateAction<SearchValue>>;
  getItemText: GetItemFunc<string>;
  getItemValue: GetItemFunc<string>;
  isItemDisabled: GetItemFunc<boolean>;
  addItemToSelectedList: (item: AralItem) => void;
  removeItemFromSelectedList: (item: AralItem | AralSelectedItem, clearInputAndFocus?: boolean) => void;
  debugLog: (message: unknown) => void;
}

export type SingleValueProps = {
  item: AralSelectedItem;
}

export type MultiValuesProps = {
  items: AralSelectedItem[];
  focusedValue?: string;
}

export type AralHiddenInputsProps = {
  name: string;
  items: AralSelectedItem[];
}

export type PlaceholderProps = {
  text: string;
}

export type ControlProps = PropsWithChildren<{
  placeholder: string | JSX.Element | (() => ReactNode);
  required: boolean;
  inputProps: AralProps['inputProps'];
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onInputBlur: (event: FocusEvent<HTMLInputElement>) => void;
}>;

export type NoItemsMessageProps = {
  message: string;
}

export type AralInputValue = {
  inputValue: string;
}

export type AralMenuProps = PropsWithChildren<{
  menuRef: RefCallback<HTMLElement>;
  shouldHide: boolean;
}>

export type MenuProps = {
  items: AralItem[];
  noItemsMessage: string | JSX.Element | ((props: AralInputValue) => ReactNode);
  menuRef: AralMenuProps['menuRef'];
  menuElement?: AralProps['menuElement'];
  itemElement?: AralProps['itemElement'];
}

export type AralItemProps = {
  text: string;
  value: string;
  item: AralItem;
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
  highlight: string;
  select: () => void;
  deselect: () => void;
  onHover: () => void;
}

export type AralProps = {
  id?: string;
  name: string;
  defaultValue?: AralItem | AralItem[];
  items?: AralItem[];
  required?: boolean;
  placeholder?: ControlProps['placeholder'];
  isDisabled?: boolean;
  isMulti?: boolean;
  isLoading?: boolean;
  disableHighlight?: boolean;
  enableDebugMode?: boolean;
  hideSelectedItems?: boolean;
  closeMenuOnSelect?: boolean;
  isMenuOpen?: boolean;
  inputProps?: ComponentPropsWithoutRef<'input'> & { [key: string]: any; };
  noItemsMessage?: MenuProps['noItemsMessage'];
  loadItems?: (value: string) => AralItem[] | Promise<AralItem[]>;
  loadingElement?: JSX.Element | ((props: AralInputValue) => ReactNode);
  menuElement?: (props: AralMenuProps) => ReactNode;
  itemElement?: (props: AralItemProps) => ReactNode;
  getItemText?: GetItemFunc<string>;
  getItemValue?: GetItemFunc<string>;
  isItemDisabled?: GetItemFunc<boolean>;
}
