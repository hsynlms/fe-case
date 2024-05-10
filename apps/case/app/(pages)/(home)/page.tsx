'use client'

import type { JSX } from 'react'
import type { AralItem } from '@fe-case/aral-select'
import { AralSelect } from '@fe-case/aral-select'

import { Item } from './item'

export const dynamic = 'force-dynamic'

export default function Page(): JSX.Element {
  const loadItems = async (value: string): Promise<AralItem[]> => {
    // fetch `Rick and Morty` character list
    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/character/?name=${encodeURIComponent(value)}`, {})
      .then(resp => resp.json())
      .then(resp => resp.results)
  }

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <strong>Aral Select</strong> component
      </div>

      <AralSelect
        name={'_rick_and_morty_'}
        getItemText={(item: AralItem) => item['name']}
        getItemValue={(item: AralItem) => item['id']}
        loadItems={loadItems}
        itemElement={Item}
        isMulti={true}
      />
    </>
  )
}
