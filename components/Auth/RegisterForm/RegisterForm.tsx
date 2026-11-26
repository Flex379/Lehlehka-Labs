"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";

import styles from "./RegisterForm.module.css";
import { registerValidationSchema } from "./validationSchema";
import { register } from "@/lib/api/clientApi";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      await register(values);

      toast.success("Реєстрація успішна!");

      router.push("/profile/edit");
    } catch (error) {
      console.error("Registration error:", error);

      toast.error("Не вдалося зареєструватися. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Реєстрація</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={registerValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Ім'я*</label>

              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Ваше ім'я"
              />

              <ErrorMessage
                name="name"
                component="span"
                className={styles.error}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Пошта*</label>

              <Field
                id="email"
                name="email"
                type="email"
                placeholder="hello@leleka.com"
              />

              <ErrorMessage
                name="email"
                component="span"
                className={styles.error}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Пароль*</label>

              <Field
                id="password"
                name="password"
                type="password"
                placeholder="********"
              />

              <ErrorMessage
                name="password"
                component="span"
                className={styles.error}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Зачекайте..." : "Зареєструватися"}
            </button>
          </Form>
        )}
      </Formik>

      <p className={styles.footer}>
        Вже маєте акаунт? <Link href="/auth/login">Увійти</Link>
      </p>
    </div>
  );
}
