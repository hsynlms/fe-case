# Aral Select

A customizable and easy-to-use select control for React applications, designed to enhance user experience with smooth interactions and a variety of configuration options.

## Table of Contents

- [Usage](#usage)
- [Options](#options)
- [License](#license)

## Usage

```tsx
import type { JSX } from 'react'
import type { AralItem } from '@fe-case/aral-select'
import { AralSelect } from '@fe-case/aral-select'

function Page(): JSX.Element {
  return (
    <AralSelect
      name={'_rick_and_morty_'}
      getItemText={(item: AralItem) => item['name']}
      getItemValue={(item: AralItem) => item['id']}
      items={[]}
      isMulti={true}
    />
  )
}
```

## Options

- `id` - The unique ID to set on the Aral Select component
- `name` - The name of the HTML input (no input will be rendered in case of leaving this empty)
- `defaultValue` - The default value(s) to be shown at start
- `items` - Array of items that populate the select menu
- `required` - Marks the value-holding input as required for form validation
- `placeholder` - Placeholder for the select value
- `isDisabled` - Disables the select control
- `isMulti` - Support multiple selected items
- `isLoading` - Is the select control in a state of loading (async)
- `disableHighlight` - Disables highlighting the search term
- `enableDebugMode` - Enables inserting debug logs into the console
- `hideSelectedItems` - Hide the selected item from the select menu
- `closeMenuOnSelect` - Close the select menu when the user selects an item
- `isMenuOpen` - Whether the select menu is open
- `inputProps` - To set and/or overwrite existing HTML input attributes
- `noItemsMessage` - Text to display when there are no items to show
- `loadItems` - The async function that fetches and returns the items
- `loadingElement` - The custom loading component
- `menuElement` - The custom menu component
- `itemElement` - The custom item component
- `getItemText` - The function that extracts the text from the item
- `getItemValue` - The function that extracts the value from the item
- `isItemDisabled` - The function that decides if the item must be in disabled state

## License

MIT. Copyright (c) Huseyin ELMAS 2024.
