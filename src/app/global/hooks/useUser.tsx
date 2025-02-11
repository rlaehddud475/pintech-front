'use client'
import { useContext, useEffect } from 'react'
import UserContext from '../contexts/UserContext'
import { getUserInfo } from '../../member/services/actions'

export default function useUser() {
  const {
    state: { userInfo, isLogin, isAdmin },
    actions: { setUserInfo, setIsLogin, setIsAdmin },
  } = useContext(UserContext)

  useEffect(() => {
    if (!userInfo) {
      ;(async () => {
        const _userInfo = await getUserInfo()
        if (_userInfo) {
          setUserInfo(_userInfo)
          setIsLogin(_userInfo ? true : false)
          setIsAdmin(_userInfo && _userInfo._authorities.includes('ADMIN'))
        }
      })()
    }
  }, [userInfo, setUserInfo, setIsLogin, setIsAdmin])

  return { userInfo, isLogin, isAdmin }
}
