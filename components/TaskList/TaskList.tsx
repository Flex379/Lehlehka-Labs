"use client";

import styles from "./TaskList.module.css";

export interface TaskListItem {
  id: string;
  name: string;
  date: string;
  isDone: boolean;
}

interface TaskListProps {
  tasks: TaskListItem[];
  onToggle: (task: TaskListItem) => void;
  pendingTaskId?: string;
}

function formatTaskDate(value: string): string {
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (iso) return `${iso[3]}.${iso[2]}`;
  const display = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (display) return `${display[1]}.${display[2]}`;
  return value;
}

export default function TaskList({ tasks, onToggle, pendingTaskId }: TaskListProps) {
  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <li className={styles.item} key={task.id}>
          <span className={styles.date}>{formatTaskDate(task.date)}</span>
          <label className={styles.row}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={task.isDone}
              disabled={pendingTaskId !== undefined}
              onChange={() => onToggle(task)}
            />
            <span className={task.isDone ? styles.completed : styles.name}>{task.name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
