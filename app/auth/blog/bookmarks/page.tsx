import { poppins } from "@/app/ui/fonts";
import { auth } from "@/auth";
import { readingList } from "@/lib/actions";

export default async function Bookmarks() {
  const session = await auth();
  const readingListData = session?.user?.email
    ? await readingList(session.user.email)
    : "";

  console.log("readingListData", readingListData);

  return (
    <div className="flex flex-col min-h-screen w-full px-8 py-8 md:px-20 2xl:px-40 mt-20">
      <div className="w-full max-w-4xl mx-auto">
        <div
          className={`${poppins.className} text-text text-center font-semibold text-3xl md:text-4xl`}
        >
          <h1>{`Reading list (${readingListData.length})`}</h1>
        </div>
      </div>
    </div>
  );
}
