import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  name: Yup.string().min(2, "Мінімум 2 символи").required("Введіть ім'я"),

  email: Yup.string().email("Введіть коректну пошту").required("Введіть пошту"),

  password: Yup.string()
    .min(8, "Пароль повинен містити мінімум 8 символів")
    .required("Введіть пароль"),
});
