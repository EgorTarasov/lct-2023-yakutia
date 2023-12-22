import { Link } from "react-router-dom";
import { Button, Layout } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/store";
import { logout } from "../features/auth/authSlice";
import Logo from "../assets/icons/logo.svg";

const { Header, Content } = Layout;

type LayoutProps = {
  children: React.ReactNode;
};



export const PageLayout = ({ children }: LayoutProps) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Header className="bg-white flex justify-around items-center pt-5 px-0" >
        <Link to="/" className="hidden">
          <img src={Logo} />
        </Link>
        {auth.isAuth && (
          <div className="flex gap-5">
            <Link to="/dashboard" className="flex">
              <Button type="default">
                <div className="flex justify-center gap-3">
                  <p className="text-caption">Главная</p>
                </div>
              </Button>
            </Link>
            <Link to="/profile" className="flex">
              <Button type="default">
                <div className="flex justify-center gap-3">
                  <UserOutlined />
                  <p className="text-caption">Профиль</p>
                </div>
              </Button>
            </Link>
            <Button type="default" onClick={handleLogout} className="flex items-center">
              <LogoutOutlined />
              <p className="text-body"></p>
            </Button>
          </div>
        )}
      </Header>
      <Content className="flex flex-col justify-between md:px-[50px] bg-white my-auto">
        {children}
      </Content>
    </>
  );
};
