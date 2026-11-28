"use client";

import { useEffect, useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createDiaryEntry,
  updateDiaryEntry,
} from "@/lib/api/clientApi";
import type { CreateDiaryEntryRequest } from "@/types/api";
import type { DiaryEntry } from "@/types/diary";
import AddDiaryEntryForm, {
  type DiaryEntryFormValues,
} from "./AddDiaryEntryForm";
import styles from "./AddDiaryEntryModal.module.css";

interface AddDiaryEntryModalProps {
  initialEntry?: DiaryEntry | null;
  onClose: () => void;
}

export default function AddDiaryEntryModal({
  initialEntry = null,
  onClose,
}: AddDiaryEntryModalProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const queryClient = useQueryClient();
  const isEditing = Boolean(initialEntry);

  const saveMutation = useMutation({
    mutationFn: (values: CreateDiaryEntryRequest) =>
      initialEntry
        ? updateDiaryEntry(initialEntry._id, values)
        : createDiaryEntry(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["diary"] });
      toast.success(isEditing ? "Запис оновлено." : "Запис створено.");
      onClose();
    },
    onError: () => {
      toast.error(
        isEditing
          ? "Не вдалося оновити запис. Спробуйте ще раз."
          : "Не вдалося створити запис. Спробуйте ще раз.",
      );
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(values: DiaryEntryFormValues) {
    await saveMutation.mutateAsync({
      title: values.title.trim(),
      description: values.description.trim(),
      emotions: values.emotions,
    });
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Закрити модальне вікно"
          onClick={onClose}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <h2 id={titleId} className={styles.title}>
          {isEditing ? "Редагувати запис" : "Новий запис"}
        </h2>

        <AddDiaryEntryForm
          initialEntry={initialEntry}
          isSaving={saveMutation.isPending}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
}
