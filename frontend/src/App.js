import React from "react";
import ToDoList from "./List";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
function App() {
  return (
    <Router>
      <div className="App">
        <h1>To Do List</h1>
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="/list" element={<ToDoList />} />

          <Route
            path="/"
            element={
              <>
                <h2>ログイン</h2>
                <div>
                  <Login />
                  <a href="/register">新規登録</a> |{" "}
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
