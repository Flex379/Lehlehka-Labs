import AuthLayout from "@/components/Auth/AuthLayout/AuthLayout";
import LoginForm from "@/components/Auth/LoginForm/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout image="/auth/login/login.png" imageAlt="Login illustration">
      <LoginForm />
    </AuthLayout>
  );
}
