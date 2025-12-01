import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  logInStart,
  logInSuccess,
  logInFailure,
} from "../../../redux/user/userSlice.js";
import API_BASE_URL from "../../../constant.js";
import Spinner from "../../../components/Spinner.jsx";
import logo from "../../../../public/assets/logo.svg";
import "../../../styles/register.css";

export default function AdminLoginForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [_, setCookies] = useCookies(["access_token"]);

  const onFinish = async (values) => {
    try {
      dispatch(logInStart());
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/admin-login`,
        {
          username: values.username,
          password: values.password,
        }
      );

      const { user, access_token } = response.data.data;

      // Check if user is actually an admin
      if (user.role !== "admin") {
        message.error("Access denied. Admin credentials required.");
        dispatch(logInFailure({ message: "Not an admin" }));
        return;
      }

      dispatch(logInSuccess(response));
      message.success("Admin login successful!");
      setCookies("access_token", access_token);
      window.localStorage.setItem("userID", user._id);
      window.localStorage.setItem("access_token", access_token);
      navigate("/admin/dashboard");
    } catch (err) {
      message.error(err.response?.data?.message || "Invalid admin credentials");
      console.error(err);
      dispatch(logInFailure(err));
    }
  };

  return (
    <div className="formContainer">
      <Form form={form} onFinish={onFinish}>
        <div className="registerFormLogo">
          <img src={logo} alt="logo" />
          <h2>Admin Login</h2>
        </div>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Username" className="formInput" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" className="formInput" />
        </Form.Item>
        <Form.Item>
          {loading ? (
            <Button type="primary" htmlType="submit">
              <Spinner />
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Login as Admin
            </Button>
          )}
          <Link to="/auth/login">Not an admin? User Login</Link>
        </Form.Item>
      </Form>
    </div>
  );
}
