import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import home from "./pages/home";
import savedRecipes from "./pages/savedRecipes";
import createRecipe from "./pages/createRecipe";
import authLayout from "./pages/auth/authLayout";
import registerForm from "./pages/auth/forms/registerForm";
import loginForm from "./pages/auth/forms/loginForm";
import PrivateRoute from "./components/PrivateRoute";
import myRecipes from "./pages/myRecipes";
import Error404 from "./components/Error404.jsx";
import AdminLoginForm from "./pages/auth/forms/AdminLoginForm";
import AdminAuthLayout from "./pages/auth/adminAuthLayout";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public home page */}
          <Route index Component={home}></Route>

          {/* Regular Auth routes */}
          <Route Component={authLayout}>
            <Route path="auth/login" Component={loginForm}></Route>
            <Route path="auth/register" Component={registerForm}></Route>
          </Route>

          {/* Admin Auth routes (with same layout style) */}
          <Route Component={AdminAuthLayout}>
            <Route path="/admin/login" Component={AdminLoginForm}></Route>
          </Route>

          {/* Protected Admin routes */}
          <Route element={<PrivateRoute adminOnly={true} />}>
            <Route path="/admin/dashboard" Component={AdminDashboard}></Route>
          </Route>

          {/* Protected user routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/create-recipe" Component={createRecipe}></Route>
            <Route path="/saved-recipes" Component={savedRecipes}></Route>
            <Route path="/my-recipes" Component={myRecipes}></Route>
          </Route>

          {/* Error 404 */}
          <Route path="*" Component={Error404}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;