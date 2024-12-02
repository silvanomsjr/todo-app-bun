import UsersCard from "@/components/UsersCard";
export default async function UsersPage() {
  return (
    <div className="w-100 h-screen flex-col flex justify-center items-center">
      <span>Usuarios são:</span>
      <UsersCard />
    </div>
  );
}
