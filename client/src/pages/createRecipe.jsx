import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Input, Form, Button, message } from "antd";
import createRecipeImg from "../../public/assets/createRecipe.png";
import "../styles/createRecipe.css";
import UploadWidget from "../components/UploadWidget.jsx";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner.jsx";
import API_BASE_URL from "../constant.js";

const CreateRecipe = () => {
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?.data?.data?.user?._id;

  const navigate = useNavigate();
  const [cookies] = useCookies(["access_token"]);
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);

      const payload = {
        ...values,
        cookingTime: Number(values.cookingTime),
        userOwner: userId,
      };

      await axios.post(`${API_BASE_URL}/api/v1/recipe/create`, payload, {
        headers: { authorization: cookies.access_token },
      });

      message.success("Recipe created");
      navigate("/");
    } catch (error) {
      console.error(error);
      message.error("Failed to create recipe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (imageUrl) => {
    form.setFieldsValue({ recipeImg: imageUrl });
  };

  return (
    <>
      <Navbar />
      <div className="createRecipeContainer container">
        <p className="sectionHeading">Create Recipe</p>

        <div className="createRecipe">
          <img src={createRecipeImg} alt="Create Recipe" />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ ingredients: [], cookingTime: 0 }}
            className="createRecipeForm"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input the name!" }]}
            >
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input.TextArea placeholder="Description" />
            </Form.Item>

            <Form.List name="ingredients">
              {(fields, { add, remove }) => (
                <div>
                  <label>Ingredients</label>
                  {fields.map((field, index) => (
                    <div
                      key={field.key}
                      style={{ display: "flex", gap: 8, marginBottom: 8 }}
                    >
                      <Form.Item
                        {...field}
                        style={{ flex: 1, marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: "Ingredient cannot be empty",
                          },
                        ]}
                      >
                        <Input placeholder={`Ingredient ${index + 1}`} />
                      </Form.Item>
                      <Button type="link" onClick={() => remove(field.name)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} style={{ marginTop: 8 }}>
                    Add Ingredient
                  </Button>
                </div>
              )}
            </Form.List>

            <Form.Item
              name="instructions"
              label="Instructions"
              rules={[
                { required: true, message: "Please input the instructions!" },
              ]}
            >
              <Input.TextArea placeholder="Instructions" />
            </Form.Item>

            <Form.Item
              name="recipeImg"
              label="Recipe Image"
              rules={[
                { required: true, message: "Please upload the recipe image!" },
              ]}
            >
              <Input placeholder="Image URL" disabled />
              <UploadWidget onImageUpload={handleImageUpload} />
            </Form.Item>

            <Form.Item
              name="cookingTime"
              label="Cooking Time (minutes)"
              rules={[
                { required: true, message: "Please input the cooking time!" },
              ]}
            >
              <Input type="number" placeholder="Cooking Time (minutes)" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : "Create Recipe"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateRecipe;
