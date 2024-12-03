import Image from "next/image";
import LoginForm from "@/components/Forms/LoginForm";
import dd from "@/../public/login.svg";

export default function InputForm() {
  console.log("Dd: ", dd);
  return (
    <main className="w-full h-screen flex flex-row justify-around ">
      <div
        className="w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url('/login.svg')",
        }}
      >
        <Image
          className="dark:invert"
          src="/fingerprint.svg"
          alt="Next.js logo"
          width={400}
          height={400}
        />
      </div>
      <div className="w-full h-screen flex flex-col gap-5 justify-center items-center">
        <h1>Entre na sua conta</h1>
        <LoginForm />
      </div>
    </main>
  );
}
