import Image from "next/image";
import LoginForm from "@/components/Forms/LoginForm";
import LoginSvg from "@/../../public/login.svg";

export default function InputForm() {
  return (
    <main className="w-full h-screen flex flex-row justify-around ">
      <div className="w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center">
        <img
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
        />
      </div>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <h1 className="mb-3">Entre na sua conta</h1>
        <LoginForm />
      </div>
    </main>
  );
}
