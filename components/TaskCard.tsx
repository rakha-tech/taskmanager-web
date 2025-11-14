"use client";

import { Task } from "@/contexts/TaskContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Edit, Clock } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusColors = {
  todo: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  "in-progress":
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {task.title}
          </CardTitle>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(task)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {task.description || "No description provided"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className={statusColors[task.status]}>
            {task.status === "in-progress"
              ? "In Progress"
              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
          <Badge className={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
            Priority
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground w-full">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Created: {format(new Date(task.createdAt), "MMM dd")}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
