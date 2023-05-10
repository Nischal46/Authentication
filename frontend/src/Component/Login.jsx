import React, { useState } from "react";
import { Form, Input, Row, Col, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const history = useNavigate();
  const [form] = Form.useForm();
  const [passVal, SetPassVal] = useState("");
  console.log(passVal);

  const LoginAPI = "http://127.0.0.1:8000/user/login";
  const loginFunction = async (data) => {
    const response = await axios.post(LoginAPI, data);
    return response;
  };

  const passChange = (e) => {
    SetPassVal(e.target.value);
  };

  const onfinish = (vals) => {
    console.log(vals);
    const formData = {
      email: vals.email,
      password: vals.password,
    };

    loginFunction(formData)
      .then((res) => {
        console.log(res);
        message.success("Login Successfully");
        if (res.status === 200 && res.data.data.role) {
          localStorage.setItem("user_name", res.data.data.name);
          localStorage.setItem("user_email", res.data.data.email);
        }
        history("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
        form.resetFields();
      });
  };
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "100vh",
        backgroundColor: "rgb(230, 230, 230)",
      }}
    >
      <Col
        xs={24}
        sm={18}
        md={16}
        lg={8}
        xl={8}
        xxl={6}
        style={{
          backgroundColor: "white",
          boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.0784313725490196)",
          padding: "1em 2em",
        }}
      >
        {/* <img src={Logo} /> */}
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <Form
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            // background: "whitesmoke",
          }}
          layout={"vertical"}
          autoComplete="off"
          onFinish={onfinish}
          hideRequiredMark
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password onChange={passChange} />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Log in
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <span>
              Need an account? <a onClick={() => history("/")}>Sign Up</a>
            </span>
            <br />
            <span>or</span>
            <br />
            <span>
              <a onClick={() => history("/forgotpass")}>Forgot Password</a>
            </span>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
