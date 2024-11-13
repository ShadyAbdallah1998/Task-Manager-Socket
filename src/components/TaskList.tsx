import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const { state } = useTaskContext();

  return (
    <div>
      {state.tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
