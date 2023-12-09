import Head from 'next/head'
import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "@fontsource/merriweather";
import './globals.css'
import RecoidContextProvider from './recoil/commonRecoil';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WorlDisaster',
  description: 'Global Disasters Portal Real-time Alerts & Historical Archives',
}


// 루트 레이아웃 컴포넌트
export default function RootLayout({
  children,
}: {
  children: React.ReactNode  // 자식 컴포넌트를 받기 위한 props
}) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <title>WorlDisaster</title>
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