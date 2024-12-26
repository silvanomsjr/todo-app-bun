import Image from "next/image";
import LoginForm from "@/components/Forms/LoginForm";

export default async function LoginPage() {
  return (
    <main className="w-full h-screen flex flex-col md:flex-row">
      <div
        className="flex-1 w-full h-screen absolute md:static bg-cover bg-center bg-no-repeat flex p-8 justify-center items-center"
        style={{
          backgroundImage: "url('/login.svg')",
        }}
      >
        <Image
          src="/fingerprint.svg"
          alt="Next.js logo"
          width={400}
          height={400}
          className="hidden md:block"
        />
      </div>
      <div className="flex-1 p-8 flex z-20 justify-center items-center">
        <div className="w-full max-w-[400px] max-h-[500px] p-8 flex flex-col gap-5 justify-center items-center bg-gray-100 dark:bg-[#0b0b0e] rounded-md md:bg-inherit md:dark:bg-inherit">
          <h1>Entre na sua conta</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
