"use client";

import { useEffect, useId, useRef } from "react";
import AddTaskForm, { type TaskFormValues } from "@/components/AddTaskForm/AddTaskForm";
import styles from "./AddTaskModal.module.css";

interface AddTaskModalProps {
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialValues?: TaskFormValues;
  submitError?: string;
}

export default function AddTaskModal({ onClose, onSubmit, initialValues, submitError }: AddTaskModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
        }
      }}
    >
      <div className={styles.content}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрити">
          <svg width="24" height="24" aria-hidden="true"><use href="/icons-sprite.svg#icon-close" /></svg>
        </button>
        <h2 className={styles.title} id={titleId}>{initialValues ? "Редагувати завдання" : "Нове завдання"}</h2>
        <AddTaskForm initialValues={initialValues} onSubmit={onSubmit} submitError={submitError} />
      </div>
    </dialog>
  );
}
