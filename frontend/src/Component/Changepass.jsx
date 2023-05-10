import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Space,
  Progress,
  Alert,
} from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Changepass = () => {
  const { id } = useParams();
  const [inputPass, setInputPass] = useState({ inputpassword: "" });
  const [passResponse, setPassResponse] = useState("");

  console.log(id);
  const history = useNavigate();
  //   const [form] = Form.useForm();

  const API = `http://localhost:8000/user/changepassword/${id}`;

  const passwordChange = async (data) => {
    const response = await axios.patch(API, data);
    return response;
  };
  const onfinish = (vals) => {
    console.log(vals);
    passwordChange({
      password: vals.password,
    })
      .then((res) => {
        console.log(res);
        message.success("Password Changed Successfully");
        history("/");
      })
      .catch((error) => {
        message.error(error.response.data.message);
        // form.resetFields();
      });
  };

  const passwordInput = (e) => {
    const pattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
    );

    let inputpassword = e.target.value;
    setInputPass({
      // ...inputPass,
      inputpassword: e.target.value,
    });

    if (pattern.test(inputpassword) && inputpassword.length <= 8)
      setPassResponse("Medium");
    else if (pattern.test(inputpassword) && inputpassword.length >= 8)
      setPassResponse("Strong");
    else setPassResponse("Weak");
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
        <Form layout={"vertical"} onFinish={onfinish}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password" }]}
            onChange={passwordInput}
          >
            <Input.Password />
          </Form.Item>

          <span>
            {inputPass.inputpassword ? (
              passResponse === "Strong" ? (
                <Form.Item>
                  <Space direction="vertical">
                    <Progress
                      style={{ width: 450 }}
                      percent={100}
                      size="small"
                      status="success"
                    />
                    <span style={{ color: "green" }}> Strong Password</span>
                  </Space>
                </Form.Item>
              ) : passResponse === "Medium" ? (
                <Form.Item>
                  <Space direction="vertical">
                    <Progress
                      style={{ width: 450 }}
                      percent={70}
                      size="small"
                      showInfo={false}
                    />
                    <span style={{ color: "blue" }}> Medium Password</span>
                  </Space>
                  <Alert
                    style={{ marginTop: "1rem" }}
                    message="Informational Notes"
                    description="Password must contains a character, uppercase, lowercase, number with max length of 8."
                    type="info"
                    showIcon
                  />
                </Form.Item>
              ) : (
                <Form.Item>
                  <Space direction="vertical">
                    <Progress
                      style={{ width: 450 }}
                      percent={30}
                      size="small"
                      status="exception"
                    />
                    <span style={{ color: "red" }}> Weak Password</span>
                  </Space>
                  <Alert
                    style={{ marginTop: "1rem" }}
                    message="Informational Notes"
                    description="Password must contains a character, uppercase, lowercase, number with max length of 8."
                    type="info"
                    showIcon
                  />
                </Form.Item>
              )
            ) : null}
          </span>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Change
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Changepass;
