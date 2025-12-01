import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Popover, Button } from "antd";
import { useCookies } from "react-cookie";
import {
  MenuFoldOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";

import logo from "../../public/assets/logo.svg";
import "../styles/navbar.css";

import { useSelector } from "react-redux";

const Navbar = () => {
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth/login");
  };

  const { currentUser } = useSelector((state) => state.user);

  // Check if user is logged in and safely get user data
  const isLoggedIn = currentUser?.data?.data?.user;
  const userName = isLoggedIn ? currentUser.data.data.user.username : null;
  const userEmail = isLoggedIn ? currentUser.data.data.user.email : null;

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <button onClick={logout}>Logout</button>
      </Menu.Item>
    </Menu>
  );

  const content = (
    <div>
      <p>Email: {userEmail}</p>
      <Button type="primary" onClick={logout}>
        Logout
      </Button>
    </div>
  );

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav>
      <div
        className={`navbarContainer container ${showMenu ? "showMenu" : ""}`}
      >
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="hamburgerIcon" onClick={toggleMenu}>
          {showMenu ? (
            <CloseOutlined className="closeIcon" />
          ) : (
            <MenuFoldOutlined className="menuIcon" />
          )}
        </div>
        <div className={`menuItems ${showMenu ? "show" : ""}`}>
          <Link to="/">Home</Link>
          {isLoggedIn && (
            <>
              <Link to="/create-recipe">Create Recipes</Link>
              <Link to="/saved-recipes">Saved Recipes</Link>
              <Link to="/my-recipes">My Recipes</Link>
            </>
          )}
        </div>
        <div className="userProfile">
          {isLoggedIn ? (
            <Popover content={content} title={userName}>
              <span>
                <UserOutlined /> {userName}
              </span>
            </Popover>
          ) : (
            <div>
              <Link to="/admin/login">
                <Button type="primary">Admin Login</Button>
              </Link>
              <Link to="/auth/login">
                <Button style={{ marginLeft: "10px" }} type="primary">
                  Login
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button style={{ marginLeft: "10px" }}>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
