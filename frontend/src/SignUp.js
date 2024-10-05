import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5134/api/User/signUp",
        {
          userId: userName,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      alert("Sign up successful!");
      navigate("/list");
    } catch (error) {
      console.log("Form submitted");
      alert("そのユーザーネームはすでに使用されています");
    }

    localStorage.setItem("user_Id", userName);
  };
  return (
    <form onSubmit={handleSubmit}>
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
        autocomplete="username"
      />
      <input
        type="password"
        value={password}
        id="password"
        name="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        required
        placeholder="Password"
        autocomplete="current-password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
export default SignUp;
