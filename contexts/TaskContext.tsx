"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  createdAt: string;
  userId: string;
}

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, "id" | "createdAt" | "userId">) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user, token]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "userId">
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        userId: user?.id || "1",
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (err) {
      setError("Failed to add task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, ...taskData } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (err) {
      setError("Failed to update task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (err) {
      setError("Failed to delete task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
