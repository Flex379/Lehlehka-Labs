"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useId } from "react";
import TaskLoader from "@/components/TasksReminderCard/TaskLoader";
import styles from "./AddTaskForm.module.css";

export interface TaskFormValues {
  name: string;
  date: string;
}

interface AddTaskFormProps {
  initialValues?: TaskFormValues;
  submitError?: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

function getToday(): string {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

function isValidDate(value?: string): boolean {
  if (!value || !/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split(".").map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Введіть назву завдання"),
  date: Yup.string()
    .required("Введіть дату")
    .test("valid-date", "Введіть коректну дату у форматі ДД.ММ.РРРР", isValidDate),
});

export default function AddTaskForm({ initialValues, onSubmit, submitError }: AddTaskFormProps) {
  const id = useId();
  const nameId = `${id}-task-name`;
  const dateId = `${id}-task-date`;
  return (
    <Formik<TaskFormValues>
      initialValues={initialValues ?? { name: "", date: getToday() }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit({ name: values.name.trim(), date: values.date });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor={nameId}>Назва завдання</label>
            <Field
              id={nameId}
              name="name"
              type="text"
              placeholder="Прийняти вітаміни"
              className={styles.input}
              aria-invalid={Boolean(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? `${nameId}-error` : undefined}
            />
            <ErrorMessage name="name" component="p" id={`${nameId}-error`} className={styles.error} />
          </div>
          <div className={styles.field}>
            <label htmlFor={dateId}>Дата</label>
            <Field
              id={dateId}
              name="date"
              type="text"
              placeholder="ДД.ММ.РРРР"
              className={styles.input}
              aria-invalid={Boolean(touched.date && errors.date)}
              aria-describedby={touched.date && errors.date ? `${dateId}-error` : undefined}
            />
            <ErrorMessage name="date" component="p" id={`${dateId}-error`} className={styles.error} />
          </div>
          {submitError && <p role="alert" className={styles.error}>{submitError}</p>}
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? <TaskLoader /> : "Зберегти"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
