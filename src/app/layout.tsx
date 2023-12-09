import Head from 'next/head'
import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "@fontsource/merriweather";
import './globals.css'
import RecoidContextProvider from './recoil/dataRecoil';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WorlDisaster',
  description: 'Global Disasters Portal Real-time Alerts & Historical Archives',
}


///////////// RootLayout /////////////
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className={inter.className}>
        <RecoidContextProvider>
          <div className='w-[100vw] h-[100vh] overflow-hidden'>
            {children}
          </div>
        </RecoidContextProvider>
      </body>
    </html>
  )
}