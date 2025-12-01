import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  message,
  Statistic,
  Row,
  Col,
  Popconfirm,
  Tabs,
  Avatar,
} from "antd";
import { UserOutlined, BookOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../constant";
import "../styles/admin.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    popularRecipes: [],
    recentRecipes: [],
  });
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [recipesPage, setRecipesPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRecipes, setTotalRecipes] = useState(0);

  // Get token from localStorage or cookies
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers(1);
    fetchRecipes(1);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/admin/dashboard-stats`,
        {
          headers: { authorization: token },
        }
      );
      setStats(response.data.data);
    } catch (error) {
      message.error("Failed to fetch dashboard stats");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/admin/users?page=${page}&limit=10`,
        {
          headers: { authorization: token },
        }
      );
      setUsers(response.data.data.users);
      setTotalUsers(response.data.data.total);
      setUsersPage(page);
    } catch (error) {
      message.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/admin/recipes?page=${page}&limit=10`,
        {
          headers: { authorization: token },
        }
      );
      console.log(response, "recipe");
      setRecipes(response.data.data.recipes);
      setTotalRecipes(response.data.data.total);
      setRecipesPage(page);
    } catch (error) {
      message.error("Failed to fetch recipes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/admin/users/${userId}`, {
        headers: { authorization: token },
      });
      message.success("User deleted successfully");
      fetchUsers(usersPage);
      fetchDashboardStats();
    } catch (error) {
      message.error("Failed to delete user");
      console.error(error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/admin/recipes/${recipeId}`, {
        headers: { authorization: token },
      });
      message.success("Recipe deleted successfully");
      fetchRecipes(recipesPage);
      fetchDashboardStats();
    } catch (error) {
      message.error("Failed to delete recipe");
      console.error(error);
    }
  };

  const userColumns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Saved Recipes",
      dataIndex: "savedRecipes",
      key: "savedRecipes",
      render: (recipes) => recipes?.length || 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Delete this user?"
          description="This will delete all their recipes and remove them from the system."
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const recipeColumns = [
    {
      title: "Image",
      dataIndex: "recipeImg",
      key: "recipeImg",
      render: (img) => <Avatar src={img} size={50} shape="square" />,
    },
    {
      title: "Recipe Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Created By",
      dataIndex: ["userOwner", "username"],
      key: "creator",
      render: (username) => username || "Unknown",
    },
    {
      title: "Cooking Time",
      dataIndex: "cookingTime",
      key: "cookingTime",
      render: (time) => `${time} mins`,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Delete this recipe?"
          description="This will permanently remove this recipe from the platform."
          onConfirm={() => handleDeleteRecipe(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const dashboardTab = (
    <div className="adminTabContent">
      <h1 className="adminHeading">Admin Dashboard</h1>

      <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Recipes"
              value={stats.totalRecipes}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Most Popular Recipes" loading={loading}>
            {stats.popularRecipes?.map((recipe) => (
              <div key={recipe._id} className="recipeListItem">
                <Avatar src={recipe.recipeImg} size={50} shape="square" />
                <div className="recipeInfo">
                  <div className="recipeName">{recipe.name}</div>
                  <div className="recipeStats">
                    Saved {recipe.saveCount} times
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Recent Recipes" loading={loading}>
            {stats.recentRecipes?.map((recipe) => (
              <div key={recipe._id} className="recipeListItem">
                <Avatar src={recipe.recipeImg} size={50} shape="square" />
                <div className="recipeInfo">
                  <div className="recipeName">{recipe.name}</div>
                  <div className="recipeStats">
                    by {recipe.userOwner?.username || "Unknown"}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );

  const usersTab = (
    <div className="adminTabContent">
      <h2 className="tabHeading">User Management</h2>
      <Table
        columns={userColumns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: usersPage,
          total: totalUsers,
          pageSize: 10,
          onChange: fetchUsers,
        }}
      />
    </div>
  );

  const recipesTab = (
    <div className="adminTabContent">
      <h2 className="tabHeading">Recipe Management</h2>
      <Table
        columns={recipeColumns}
        dataSource={recipes}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: recipesPage,
          total: totalRecipes,
          pageSize: 10,
          onChange: fetchRecipes,
        }}
      />
    </div>
  );

  const tabItems = [
    {
      key: "1",
      label: "Dashboard",
      children: dashboardTab,
    },
    {
      key: "2",
      label: "Users",
      children: usersTab,
    },
    {
      key: "3",
      label: "Recipes",
      children: recipesTab,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="adminContainer">
        <Tabs defaultActiveKey="1" items={tabItems} size="large" />
      </div>
    </>
  );
}
