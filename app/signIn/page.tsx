import Link from "next/link";
export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <Link href={"/signUp"}>
          <h1>Sign In</h1>
        </Link>
      </div>
    </div>
  );
}
