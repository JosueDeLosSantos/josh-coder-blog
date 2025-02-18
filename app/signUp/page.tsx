import SignupForm from "@/app/ui/forms/SignupForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <h1>Sign UP</h1>
        <SignupForm />
      </div>
    </div>
  );
}
