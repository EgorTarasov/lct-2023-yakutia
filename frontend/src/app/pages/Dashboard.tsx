import { Link } from "react-router-dom";
import { Button, Icon } from "../../components/UI"
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/store";

export const Dashboard = () => {

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <div className="min-h-screen">
      <div className="w-full bg-[url('/src/assets/images/main_bg.png')]  bg-cover flex flex-col">
        <nav className="py-12 flex justify-between max-w-screen-2xl mx-auto w-full">
          <Link to="/"><Icon iconName="logo_white" /></Link>
          <div className="flex">
            <Link to="/profile">
              <Button colorType="secondary">
                <div className="flex justify-center gap-3">
                  <Icon iconName="pen" /><p className="text-caption">Редактировать профиль</p>
                </div>
              </Button>
            </Link>
          </div>
        </nav>
        <div className="max-w-screen-2xl mx-auto w-[50%] flex flex-col">
          <h1 className="md:text-4xl xl:text-8xl text-center h-full text-white font-bold">Ваша карьера в ваших руках</h1>'

        </div>
        <div>sd</div>
      </div>

      <Button onClick={handleLogout}>ВЫЙТИ</Button>

    </div>
  )
}
