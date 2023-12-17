import { logout } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/store";
import { Wrapper } from "../../components/UI/Wrapper";

export const Profile = () => {

  // const dispatch = useAppDispatch();

  // const handleLogout = () => {
  //   dispatch(logout());
  // }

  return (
    <Wrapper>
      <div className="">
        <p className="text-h1">Привет,</p>
        <p className="text-h1 font-bold">пользователь</p>
      </div>
    </Wrapper>
  )
}
