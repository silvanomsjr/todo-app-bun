import { getSessionUsername } from "@/lib/session";

export default async function Home() {
  const session = await getSessionUsername();
  console.log("getSessionUsername: ", session);

  return (
    <div className="w-100 h-full flex justify-center items-center">
      Bem vindo ao web-site
    </div>
  );
}
