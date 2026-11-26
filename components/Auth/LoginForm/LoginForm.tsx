"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";

import styles from "./LoginForm.module.css";
import { loginValidationSchema } from "./validationSchema";
import { login } from "@/lib/api/clientApi";

const initialValues = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      await login(values);

      toast.success("Ви успішно увійшли!");

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);

      toast.error("Неправильна пошта або пароль");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Вхід</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">Пошта</label>

              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Ваша пошта"
              />

              <ErrorMessage
                name="email"
                component="span"
                className={styles.error}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Пароль</label>

              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Пароль"
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
              {isSubmitting ? "Зачекайте..." : "Увійти"}
            </button>
          </Form>
        )}
      </Formik>

      <p className={styles.footer}>
        Не маєте акаунту? <Link href="/auth/register">Зареєструватися</Link>
      </p>
    </div>
  );
}
