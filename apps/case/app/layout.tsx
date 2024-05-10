import { PropsWithChildren } from 'react'
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap'
})

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: PropsWithChildren): JSX.Element {
  return (
    <html lang='en' dir='ltr' className={openSans.className}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0' />
      </head>

      <body>
        {children}
      </body>
    </html>
  )
}
