import LoginForm from "@/components/Forms/LoginForm";
export default function InputForm() {
  return (
    <div className="w-100 h-screen flex flex-col justify-center items-center">
      <h1 className="mb-3">Entre na sua conta</h1>
      <LoginForm />
    </div>
  );
}
