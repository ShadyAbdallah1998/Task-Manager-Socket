import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  Task,
} from "@/services/api";
import socket from "@/utils/socket";

interface TaskState {
  tasks: Task[];
}

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<any>;
}

const initialState: TaskState = { tasks: [] };
const TaskContext = createContext<TaskContextType | null>(null);

const taskReducer = (state: TaskState, action: any): TaskState => {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.userId === action.payload.userId ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.userId !== action.payload),
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    getTasks().then((tasks) => dispatch({ type: "SET_TASKS", payload: tasks }));

    socket.on("taskUpdated", (task: Task) =>
      dispatch({ type: "UPDATE_TASK", payload: task })
    );
    socket.on("taskDeleted", (taskId: number) =>
      dispatch({ type: "DELETE_TASK", payload: taskId })
    );

    return () => {
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used within TaskProvider");
  return context;
};
