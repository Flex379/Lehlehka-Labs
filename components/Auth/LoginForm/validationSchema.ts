import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Введіть коректну пошту").required("Введіть пошту"),

  password: Yup.string().required("Введіть пароль"),
});
