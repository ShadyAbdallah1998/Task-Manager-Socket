import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface Task {
  id: number;
  title?: string;
  todo?: string;
  completed: boolean;
  userId: number;
}

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(`${API_URL}`);
    const tasks = response.data.todos.map((task: any) => ({
      id: task.id,
      title: task.todo, // Map 'todo' to 'title'
      completed: task.completed,
      userId: task.userId,
    }));
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const addTask = async (task: Omit<Task, "id">): Promise<Task> => {
  try {
    const response = await axios.post(`${API_URL}/add`, {
      todo: task.title,
      completed: task.completed,
      userId: task.userId,
    });
    console.log(response);
    return {
      id: response.data.id,
      title: response.data.todo,
      completed: response.data.completed,
      userId: response.data.userId,
    };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (task: Task): Promise<Task> => {
  try {
    const response = await axios.put(`${API_URL}/${task.userId}`, {
      todo: task.title, // Use 'todo' for the task title
      completed: task.completed,
      userId: task.userId,
    });
    return {
      id: response.data.id,
      title: response.data.todo,
      completed: response.data.completed,
      userId: response.data.userId,
    };
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
