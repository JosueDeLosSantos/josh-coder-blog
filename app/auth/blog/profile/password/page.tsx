import EditPassword from "@/app/ui/forms/EditPassword";

export default async function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen blog-hero-bg max-md:pt-20">
      <EditPassword />
    </div>
  );
}
