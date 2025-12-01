import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ adminOnly = false }) {
  const { currentUser } = useSelector((state) => state.user);

  // Check if user is logged in
  const isLoggedIn = currentUser?.data?.data?.user;
  const userRole = isLoggedIn?.role;

  // If not logged in at all, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  // If admin-only route and user is not admin, redirect to home
  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
