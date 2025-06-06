import { poppins } from "@/app/ui/fonts";
import { auth } from "@/auth";
import { readingList } from "@/lib/actions";
import { BookMarkedTags } from "@/app/ui/Tags";
import { BookmarkedPosts } from "@/app/ui/PostsList";
import SearchBar from "@/app/ui/Search";
import ScrollUp from "@/app/ui/ScrollUp";

export default async function Bookmarks(props: {
  searchParams?: Promise<{
    query?: string;
    tag?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const tag = searchParams?.tag || "";
  const session = await auth();
  const readingListData = await readingList(session);

  return (
    <div className="flex flex-col min-h-screen w-full px-8 py-8 md:px-20 2xl:px-40 mt-20">
      <div className="w-full max-w-4xl mx-auto">
        <div
          className={`${poppins.className} text-text text-center font-semibold text-3xl md:text-4xl mb-8`}
        >
          <h1>{`Reading list (${readingListData.length})`}</h1>
        </div>
        <SearchBar placeholder="Search by title" />
        <BookMarkedTags readingList={readingListData} />
        <BookmarkedPosts data={readingListData} query={query} tag={tag} />
        <ScrollUp />
      </div>
    </div>
  );
}
