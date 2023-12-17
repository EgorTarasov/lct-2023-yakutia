import { Link } from "react-router-dom"
import { Button, Icon } from "../components/UI"
import { useAuth } from "../hooks/useAuth"
import { useAppDispatch } from "../hooks/store"
import { logout } from "../features/auth/authSlice"

type LayoutProps = {
  children: React.ReactNode
}

export const PageLayout = ({ children }: LayoutProps) => {

  const auth = useAuth()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }


  return (
    <div className=" mx-auto flex flex-col justify-between max-w-screen-2xl">
      <header>
        <nav className="py-5 flex justify-between">
          <Link to="/">
            <Icon iconName="logo" />
          </Link>
          {auth.isAuth &&
            <div className="flex">
              <Link to="/profile" className="flex">
                <Button colorType="outline">
                  <div className="flex justify-center gap-3">
                    <Icon iconName="user" />
                    <Icon iconName="pen" /><p className="text-body">Редактировать профиль</p>
                  </div>
                </Button>
              </Link>
              <Button colorType="outline" onClick={handleLogout}>
                <Icon iconName="sign_out" /><p className="text-body"></p>
              </Button>
            </div>}
        </nav>
      </header>
      <main>
        {children}
      </main>
    </div >
  )
}
