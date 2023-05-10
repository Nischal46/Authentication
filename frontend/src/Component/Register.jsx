import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  message,
  Space,
  Progress,
  Cascader,
  Alert,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const history = useNavigate();
  const [form] = Form.useForm();
  const recaptchaRef = useRef(null);
  const [captchaval, setCaptchaval] = useState("");
  const [inputPass, setInputPass] = useState({ inputpassword: "" });
  const [passResponse, setPassResponse] = useState("");

  const SITEKEY = "6LenKRwlAAAAANHPdfLygEiJ3GdZkrACXRM7f8I0";

  const API = "http://127.0.0.1:8000/user/register";
  const Register = async (data) => {
    const response = await axios.post(API, data);
    return response;
  };

  const onchange = (val) => {
    console.log(val);
    setCaptchaval(val);
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

  const onfinish = (vals) => {
    const formdata = {
      name: vals.name,
      email: vals.email,
      password: vals.password,
      confirmPassword: vals.confirm,
      captchaval,
    };

    Register(formdata)
      .then((res) => {
        message.success(
          "Registered User Successfully. Please check your Email to Verify"
        );
        history("/login");
      })
      .catch((err) => {
        console.log(err);
        message.error("Registration Failed");
        form.resetFields();
        recaptchaRef.current.reset();
      });
  };
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "135vh",
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
        <h1 style={{ textAlign: "center" }}>Register</h1>
        <Form
          onFinish={onfinish}
          layout="vertical"
          form={form}
          hideRequiredMark
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter a email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a Password" }]}
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

          <Form.Item
            label="Verify! You are human"
            name="recaptcha"
            rules={[{ required: true, message: "Please click on captcha box" }]}
          >
            <ReCAPTCHA sitekey={SITEKEY} onChange={onchange} />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Register
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <span>
              Already have an account?{" "}
              <a onClick={() => history("/login")}>Sign In</a>
            </span>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
