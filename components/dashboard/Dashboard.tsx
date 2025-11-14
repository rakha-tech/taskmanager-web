"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks, Task } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { TaskFilters } from "@/components/TaskFilters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, isLoading, error } =
    useTasks();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "userId">
  ) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await addTask(taskData);
        toast.success("Task created successfully!");
      }
      setIsDialogOpen(false);
      setEditingTask(undefined);
    } catch (err) {
      toast.error("Failed to save task. Please try again.");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete);
        toast.success("Task deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete task. Please try again.");
      }
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setTaskToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  }, [tasks]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <DashboardHeader />
        <main className="py-8 px-12">
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
                <p className="text-muted-foreground">
                  Manage and track your tasks efficiently
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)} size="lg">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="bg-white dark:bg-slate-900 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Tasks
                  </p>
                </div>
                <p className="text-2xl font-bold mt-2">{taskStats.total}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    To Do
                  </p>
                </div>
                <p className="text-2xl font-bold mt-2">{taskStats.todo}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </p>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {taskStats.inProgress}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Done
                  </p>
                </div>
                <p className="text-2xl font-bold mt-2">{taskStats.done}</p>
              </div>
            </div>

            <TaskFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              {searchQuery ||
              statusFilter !== "all" ||
              priorityFilter !== "all" ? (
                <>
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by creating your first task
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={openDeleteDialog}
                />
              ))}
            </div>
          )}
        </main>

        <TaskDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingTask(undefined);
            }
          }}
          onSubmit={handleCreateTask}
          task={editingTask}
          isLoading={isLoading}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTask}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
