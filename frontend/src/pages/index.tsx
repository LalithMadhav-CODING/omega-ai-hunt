import MatrixBackground from "@/components/MatrixBackground";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="login-container">
      <MatrixBackground faint={true} />
      <LoginForm />
    </div>
  );
}