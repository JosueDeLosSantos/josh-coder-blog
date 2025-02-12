import { signOut } from "@/auth";

export default async function Page() {
  return (
    <div>
      <h1>You are authorized</h1>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button className="bg-black text-white py-1 px-2 rounded" type="submit">
          Sign Out
        </button>
      </form>
    </div>
  );
}
