import { Link } from "react-router-dom";
import { Button, Layout } from "antd";
import { LogoutOutlined, } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/store";
import { logout } from "../features/auth/authSlice";
import { Icon } from "../components/UI";

const { Header, Content } = Layout;

type LayoutProps = {
  children: React.ReactNode;
};

export const AdminPageLayout = ({ children }: LayoutProps) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Layout>
      <Header className="bg-white flex justify-between items-center pt-5" >
        <Link to="/admin">
          <Icon iconName="logo" />
        </Link>
        {auth.isAuth && (
          <div className="flex gap-5">
            <Link to="/admin" className="flex">
              <Button type="default">
                <div className="flex justify-center gap-3">
                  <p className="text-caption">Создать курс</p>
                </div>
              </Button>
            </Link>
            <Link to="/graph" className="flex">
              <Button type="default">
                <div className="flex justify-center gap-3">
                  <p className="text-caption">Статистика</p>
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
      <Content className="flex flex-col justify-between md:px-[50px] bg-white">
        {children}
      </Content>
    </Layout>
  );
};
