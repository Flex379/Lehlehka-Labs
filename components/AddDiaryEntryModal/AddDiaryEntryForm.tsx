"use client";

import { useId, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { getEmotions } from "@/lib/api/clientApi";
import type { DiaryEntry } from "@/types/diary";
import styles from "./AddDiaryEntryModal.module.css";

interface EmotionApiItem {
  _id: string;
  name?: string;
  title?: string;
}

type EmotionApiResponse =
  | EmotionApiItem[]
  | { emotions?: EmotionApiItem[]; tasks?: EmotionApiItem[] };

export interface DiaryEntryFormValues {
  title: string;
  emotions: string[];
  description: string;
}

interface AddDiaryEntryFormProps {
  initialEntry: DiaryEntry | null;
  isSaving: boolean;
  onSubmit: (values: DiaryEntryFormValues) => Promise<void>;
}

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Введіть заголовок запису."),
  emotions: Yup.array()
    .of(Yup.string().required())
    .min(1, "Оберіть щонайменше одну категорію.")
    .required("Оберіть категорії."),
  description: Yup.string().trim().required("Введіть текст запису."),
});

export default function AddDiaryEntryForm({
  initialEntry,
  isSaving,
  onSubmit,
}: AddDiaryEntryFormProps) {
  const id = useId();
  const [isEmotionMenuOpen, setIsEmotionMenuOpen] = useState(false);
  const titleId = `${id}-title`;
  const emotionsId = `${id}-emotions`;
  const emotionMenuId = `${id}-emotion-menu`;
  const descriptionId = `${id}-description`;

  const emotionsQuery = useQuery({
    queryKey: ["diary", "emotions"],
    queryFn: async () => {
      const response = (await getEmotions({ limit: 100 })) as EmotionApiResponse;
      const emotions = Array.isArray(response)
        ? response
        : response.emotions ?? response.tasks ?? [];

      return emotions.map(({ _id, name, title }) => ({
        _id,
        title: title ?? name ?? "",
      }));
    },
    retry: false,
  });

  const initialValues: DiaryEntryFormValues = initialEntry
    ? {
        title: initialEntry.title,
        emotions: initialEntry.emotions.map((emotion) => emotion._id),
        description: initialEntry.description,
      }
    : { title: "", emotions: [], description: "" };

  return (
    <Formik<DiaryEntryFormValues>
      key={initialEntry?._id ?? "new-entry"}
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit({
            title: values.title.trim(),
            emotions: values.emotions,
            description: values.description.trim(),
          });
        } catch {
          // The modal displays the request error through a toast.
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting, values }) => {
        const isBusy = isSubmitting || isSaving;
        const selectedEmotions =
          emotionsQuery.data?.filter((emotion) =>
            values.emotions.includes(emotion._id),
          ) ?? [];

        return (
          <Form className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor={titleId}>Заголовок</label>
              <Field
                id={titleId}
                name="title"
                type="text"
                className={styles.input}
                placeholder="Введіть заголовок запису"
                aria-invalid={Boolean(touched.title && errors.title)}
                aria-describedby={
                  touched.title && errors.title ? `${titleId}-error` : undefined
                }
              />
              <ErrorMessage
                name="title"
                component="p"
                id={`${titleId}-error`}
                className={styles.error}
              />
            </div>

            <fieldset className={styles.fieldset}>
              <legend id={emotionsId}>Категорії</legend>
              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={styles.dropdownButton}
                  aria-expanded={isEmotionMenuOpen}
                  aria-controls={emotionMenuId}
                  aria-labelledby={emotionsId}
                  aria-invalid={Boolean(touched.emotions && errors.emotions)}
                  onClick={() => setIsEmotionMenuOpen((open) => !open)}
                  disabled={isBusy || emotionsQuery.isPending}
                >
                  <span className={styles.selectedEmotions}>
                    {selectedEmotions.length > 0
                      ? selectedEmotions.map((emotion) => (
                          <span className={styles.selectedEmotion} key={emotion._id}>
                            {emotion.title}
                          </span>
                        ))
                      : emotionsQuery.isPending
                        ? "Завантаження категорій..."
                        : "Оберіть категорії"}
                  </span>
                  <svg
                    className={styles.chevron}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isEmotionMenuOpen && !emotionsQuery.isError && (
                  <div id={emotionMenuId} className={styles.emotionMenu}>
                    {emotionsQuery.data?.length ? (
                      emotionsQuery.data.map((emotion) => (
                        <label
                          key={emotion._id}
                          className={styles.emotionOption}
                        >
                          <Field
                            type="checkbox"
                            name="emotions"
                            value={emotion._id}
                            disabled={isBusy}
                          />
                          <span>{emotion.title}</span>
                        </label>
                      ))
                    ) : (
                      <p className={styles.hint}>Немає доступних категорій.</p>
                    )}
                  </div>
                )}
              </div>
              {emotionsQuery.isError && (
                <p className={styles.error} role="alert">
                  Не вдалося завантажити категорії.
                </p>
              )}
              {touched.emotions && typeof errors.emotions === "string" && (
                <p className={styles.error} role="alert">
                  {errors.emotions}
                </p>
              )}
            </fieldset>

            <div className={styles.field}>
              <label htmlFor={descriptionId}>Запис</label>
              <Field
                as="textarea"
                id={descriptionId}
                name="description"
                rows={5}
                className={styles.input}
                placeholder="Запишіть, як ви себе відчуваєте"
                aria-invalid={Boolean(
                  touched.description && errors.description,
                )}
                aria-describedby={
                  touched.description && errors.description
                    ? `${descriptionId}-error`
                    : undefined
                }
              />
              <ErrorMessage
                name="description"
                component="p"
                id={`${descriptionId}-error`}
                className={styles.error}
              />
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={
                  isBusy || emotionsQuery.isPending || emotionsQuery.isError
                }
              >
                {isBusy ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
