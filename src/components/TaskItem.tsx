import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { updateTask, deleteTask, Task } from "@/services/api";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Include toast styles

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { dispatch } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [isSaving, setIsSaving] = useState(false); // For handling loading state

  const handleToggleComplete = async () => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const response = await updateTask(updatedTask);
      dispatch({ type: "UPDATE_TASK", payload: response });
      toast.success("Task status updated!");
    } catch (error) {
      toast.error("Error toggling task status.");
      console.error("Error toggling complete status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.userId);
      dispatch({ type: "DELETE_TASK", payload: task.userId });
      setIsDialogOpen(false);
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Error deleting task.");
      console.error("Error deleting task:", error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true); // Show loading spinner while saving
    try {
      const response = await updateTask(editedTask);
      dispatch({ type: "UPDATE_TASK", payload: response });
      setIsDialogOpen(false);
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Error updating task.");
      console.error("Error updating task:", error);
    } finally {
      setIsSaving(false); // Hide loading spinner after save attempt
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        background: "#f4f6f8",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <h3
        style={{
          textDecoration: task.completed ? "line-through" : "none",
          flex: 1,
          margin: 0,
          fontWeight: 500,
          fontSize: "16px",
          color: task.completed ? "#777" : "#333",
        }}
      >
        {task.title || task.todo || "Untitled Task"}
      </h3>
      <Button onClick={handleToggleComplete} variant="outlined" color="primary">
        {task.completed ? "Undo" : "Complete"}
      </Button>
      <Button
        onClick={() => setIsDialogOpen(true)}
        style={{ marginLeft: "10px" }}
        color="secondary"
        variant="outlined"
      >
        Edit / Delete
      </Button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modify the task details or delete the task.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            variant="outlined"
            value={editedTask.title}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
          <Button
            onClick={handleSaveChanges}
            color="primary"
            disabled={isSaving}
          >
            {isSaving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskItem;
