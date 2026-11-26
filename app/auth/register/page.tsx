import AuthLayout from "@/components/Auth/AuthLayout/AuthLayout";
import RegisterForm from "@/components/Auth/RegisterForm/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout image="/auth/register/register.png" imageAlt="Реєстрація">
      <RegisterForm />
    </AuthLayout>
  );
}
