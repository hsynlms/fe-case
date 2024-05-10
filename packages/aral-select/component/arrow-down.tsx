import type { JSX } from 'react'
import { memo } from 'react'

const Component = (): JSX.Element => (
  <svg
    xmlns={'http://www.w3.org/2000/svg'}
    xmlSpace={'preserve'}
    viewBox={'0 0 511.3 319.7'}
    aria-hidden={true}
    focusable={false}
  >
    <path d={'M501.6 61.4 282.7 307.2c-14.7 16.6-40.3 16.6-54.4 0L9.4 61.4C-11.7 37.8 4.9 0 36.9 0h437.8c31.4 0 48.6 37.8 26.9 61.4z'} />
  </svg>
)

export const ArrowDown = memo(Component)
