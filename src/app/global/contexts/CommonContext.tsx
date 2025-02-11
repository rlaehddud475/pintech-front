'use client'
import React, { useEffect } from 'react'
import { createContext, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { setDefaultLocale } from 'react-datepicker'

type ContextType = {
  state?: { title?: string }
  actions?: { setTitle?: (title: string) => void }
}

const CommonContext = createContext<ContextType>({})
const CommonProvider = ({ children }) => {
  const [title, setTitle] = useState<string | undefined>()

  // 클라이언트에서만 실행되도록 useEffect 사용
  useEffect(() => {
    setDefaultLocale('ko') // 문자열 형태로 로케일을 전달
  }, [])

  const value: ContextType = {
    state: { title },
    actions: { setTitle },
  }

  return (
    <CommonContext.Provider value={value}>
      <HelmetProvider>
        <>
          <Helmet>{title && <title>{title}</title>}</Helmet>
          {children}
        </>
      </HelmetProvider>
    </CommonContext.Provider>
  )
}

const { Consumer: CommonConsumer } = CommonContext

export { CommonProvider, CommonConsumer }
export default CommonContext
