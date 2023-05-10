import React from "react";
import { Row, Col, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Resetemail = () => {
  const history = useNavigate();
  const [form] = Form.useForm();

  const API = "http://127.0.0.1:8000/user/forgotpassword";
  const Forgotpass = async (data) => {
    const response = await axios.post(API, data);
    return response;
  };

  const onfinish = (vals) => {
    console.log(vals);
    Forgotpass({
      email: vals.email,
    })
      .then((res) => {
        console.log(res);
        message.success("Reset Link is sent to your mail. please verify.");
        form.resetFields();
      })
      .catch((error) => {
        message.error(error.response.data.message);
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
        <h3 style={{ textAlign: "center", paddingBottom: "5px" }}>
          Password Reset Link
        </h3>
        <Form layout={"vertical"} onFinish={onfinish}>
          <Form.Item
            label="Please enter your email address"
            name="email"
            rules={[
              { required: true, message: "Please enter a email address" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Send
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <span>
              Go back to <a onClick={() => history("/login")}>sign in</a>
            </span>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Resetemail;
