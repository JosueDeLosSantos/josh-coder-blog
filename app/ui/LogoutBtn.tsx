import { auth } from "@/auth";
import { logout } from "@/lib/actions";

export default async function LogoutBtn() {
  const user = await auth();
  console.log(user);

  return (
    <form action={logout}>
      <button className="bg-black text-white py-1 px-2 rounded" type="submit">
        Sign Out
      </button>
    </form>
  );
}
