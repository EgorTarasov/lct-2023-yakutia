import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function PrivateRoute() {
    const auth = useAuth()
    const location = useLocation()

    return auth.isAuth ? (
        <Outlet />
    ) : (
        <Navigate to="/" state={{ from: location }} />
    )
}
