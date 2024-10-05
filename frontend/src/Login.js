import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5134/api/User/login",
        {
          UserId: userName,
          Password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("user_Id", userName);
      console.log("User logged in:", response.data);
      alert(response.data);
      navigate("/list");
    } catch (error) {
      console.log("User logged in:", userName, password);
      alert("ログインできませんでした");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={userName}
          id="userName"
          name="userName"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          required
          placeholder="Username"
          autoComplete="username"
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
          placeholder="Password"
          autoComplete="current-password"
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
