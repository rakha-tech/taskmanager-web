"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "@/lib/api";

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

// 🔥 Normalisasi helper function (biar bersih)
const normalizeTask = (t: any): Task => ({
  ...t,
  status: t.status.toLowerCase().replace("inprogress", "in-progress"),
  priority: t.priority.toLowerCase(),
});

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

  // 📌 FETCH TASKS
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/Tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      const normalized = data.map((t: any) => normalizeTask(t));

      setTasks(normalized);
    } catch {
      setError("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  // 📌 ADD TASK
  const addTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "userId">
  ) => {
    setIsLoading(true);
    setError(null);

    // normalisasi sebelum kirim ke backend
    const sendData = {
      ...taskData,
      status: taskData.status.replace("in-progress", "inprogress"),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/Tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sendData),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const newTaskRaw = await res.json();
      const newTask = normalizeTask(newTaskRaw);

      setTasks((prev) => [...prev, newTask]);
    } catch {
      setError("Failed to add task");
    } finally {
      setIsLoading(false);
    }
  };

  // 📌 UPDATE TASK
  const updateTask = async (id: string, taskData: Partial<Task>) => {
    setIsLoading(true);
    setError(null);

    // normalisasi sebelum kirim
    const sendData = {
      ...taskData,
      status:
        taskData.status?.replace("in-progress", "inprogress") ??
        taskData.status,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/Tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sendData),
      });

      if (!res.ok) throw new Error("Failed to update task");

      const updatedRaw = await res.json();
      const updated = normalizeTask(updatedRaw);

      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } finally {
      setIsLoading(false);
    }
  };

  // 📌 DELETE TASK
  const deleteTask = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/Tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((t) => t.id !== id));
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
