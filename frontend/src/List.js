import React, { useEffect, useState } from "react";
import axios from "axios";

function ToDoList() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const user_Id = localStorage.getItem("user_Id");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5134/api/ToDo/get?user_Id=${user_Id}`
      ); // 日付を "yyyy-MM-dd" 形式に変換して設定
      const formattedTasks = response.data.map((task) => ({
        ...task,
        dueDate: task.dueDate.split("T")[0], // "2024-09-30T00:00:00"を"2024-09-30"に変換
      }));
      setTasks(formattedTasks);
      console.log("Fetched tasks:", formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    const selectedTasks = tasks.filter((task) =>
      selectedTaskIds.includes(task.id)
    );
    if (selectedTasks.length === 1) {
      const task = selectedTasks[0];
      setEditingTaskId(task.id);
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate); // ここはそのまま使用
    } else {
      alert("Please select only one task to edit.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingTaskId(null);
    setSelectedTaskIds([]);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (editingTaskId) {
      console.log("Editing task:", editingTaskId);
      try {
        const response = await axios.put(
          `http://localhost:5134/api/ToDo/edit/${editingTaskId}?user_Id=${user_Id}`,
          {
            title: title,
            description: description,
            dueDate: dueDate,
          }
        );
        alert("Task edited successfully");
        console.log(response.data);
        fetchData();
        resetForm();
      } catch (error) {
        console.error(
          "Error editing task:",
          error.response ? error.response.data : error.message
        );
        alert("Failed to edit task");
      }
    } else {
      try {
        const response = await axios.post(
          `http://localhost:5134/api/ToDo/add?user_Id=${user_Id}`,
          {
            title: title,
            description: description,
            dueDate: dueDate,
          }
        );
        alert("Task added successfully");
        console.log(response.data);
        fetchData();
        resetForm();
      } catch (error) {
        console.error(
          "Error adding task:",
          error.response ? error.response.data : error.message
        );
        alert("Failed to add task");
      }
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting task:", id);
    try {
      const response = await axios.delete(
        `http://localhost:5134/api/ToDo/delete/${id}?user_Id=${user_Id}`
      );
      alert("Task deleted successfully");
      console.log(response.data);
      fetchData();
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const toggleTaskSelection = (id) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <form onSubmit={handleEdit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              id="title"
              name="title"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              id="description"
              name="description"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Due Date"
              id="dueDate"
              name="dueDate"
            />
            <button type="submit">
              {editingTaskId ? "Edit Task" : "Add Task"}
            </button>
          </form>
          <button onClick={startEditing}>Edit Selected Task</button>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    id={`option${task.id}`}
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => toggleTaskSelection(task.id)}
                  />
                  {task.title} - {task.description || "No description"} -{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </label>

                <button onClick={() => startEditing()}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ToDoList;
