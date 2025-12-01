import { Outlet, Navigate } from "react-router-dom";
import authImg from "../../../public/assets/authImg.png";
import "../../styles/authLayout.css";
import { useSelector } from "react-redux";

export default function AdminAuthLayout() {
  const { currentUser } = useSelector((state) => state.user);

  const userID =
    currentUser && currentUser.data && currentUser.data.user
      ? currentUser.data.user._id
      : null;
  const userRole =
    currentUser && currentUser.data && currentUser.data.user
      ? currentUser.data.user.role
      : null;

  const isAdmin = !!userID && userRole === "admin";

  return (
    <>
      {isAdmin ? (
        <Navigate to="/admin/dashboard" />
      ) : (
        <div className="authContainer">
          <section className="authComponentContainer">
            <Outlet />
          </section>
          <img className="authBgImg" src={authImg} alt="logo" />
        </div>
      )}
    </>
  );
}
