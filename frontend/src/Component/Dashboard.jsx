import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, Button } from "antd";
const { Meta } = Card;

const Dashboard = () => {
  const history = useNavigate();
  return (
    <div
      style={{
        backgroundColor: "rgb(230, 230, 230)",
        height: "100vh",
        padding: "5rem",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Welcome to Dashoboard</h1>
      <Card
        style={{
          width: 600,
          margin: "0 auto",
        }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
      >
        <Meta
          style={{ font: "caption", color: "white" }}
          avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
          title={
            localStorage.getItem("user_name") ? (
              localStorage.getItem("user_name")
            ) : (
              <div>Not Logged in</div>
            )
          }
          description={
            localStorage.getItem("user_email") ? (
              localStorage.getItem("user_email")
            ) : (
              <div>Default</div>
            )
          }
        />
        <Button
          type="primary"
          style={{ marginTop: "1rem", textAlign: "center" }}
          onClick={() => {
            localStorage.clear();
            history("/login");
          }}
        >
          Log out
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;
