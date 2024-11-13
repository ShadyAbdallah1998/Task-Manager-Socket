import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { addTask, Task } from "@/services/api";
import { Button, TextField, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify"; // For toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const TaskForm = () => {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false); // For handling loading state

  const handleAddTask = async () => {
    if (!title.trim()) return; // Prevent adding empty tasks

    const newTask: Omit<Task, "id"> = {
      title,
      completed: false,
      userId: Math.floor(Math.random() * 100) + 1,
    };

    setIsAdding(true); // Show loading spinner while adding task

    try {
      const task = await addTask(newTask);
      dispatch({ type: "ADD_TASK", payload: task });
      setTitle(""); // Reset input field after adding task
      toast.success("Task added successfully!"); // Success toast notification
    } catch (error) {
      toast.error("Error adding task."); // Error toast notification
      console.error("Error adding task:", error);
    } finally {
      setIsAdding(false); // Hide loading spinner after adding task
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#f4f6f8",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: 2,
        width: "100%",
        maxWidth: "400px",
        margin: "20px auto",
      }}
    >
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Task Title"
        variant="outlined"
        fullWidth
        margin="normal"
        sx={{
          marginBottom: "16px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />
      <Button
        onClick={handleAddTask}
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          padding: "10px",
          fontWeight: "bold",
          fontSize: "16px",
          borderRadius: "8px",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#1D7A8C",
          },
        }}
        disabled={isAdding}
      >
        {isAdding ? <CircularProgress size={24} color="inherit" /> : "Add Task"}
      </Button>
    </Box>
  );
};

export default TaskForm;
