type UserT = {
  id: string;
  email: string;
  username: string;
  password: string;
};

export default async function UsersCard() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
  const users: UserT[] = await data.json();
  return (
    <div>
      {users.map((user: UserT) => (
        <div
          key={user.id}
          className="border border-sky-500 rounded flex flex-row justify-center items-start"
        >
          <span>Email: {user?.email}</span>
          <span>Username: {user?.username}</span>
        </div>
      ))}
    </div>
  );
}
