import { useMemo } from 'react'
import { selectIsAuth } from '../features/auth/authSlice'
import { useAppSelector } from './store'

export const useAuth = () => {
  const isAuth = useAppSelector(selectIsAuth)
  return useMemo(() => ({ isAuth }), [isAuth])
}