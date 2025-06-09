import SearchBar from "@/app/ui/Search";
import Tags, { TagsSkeleton } from "@/app/ui/Tags";
import { PostsList, PostsListSkeleton } from "@/app/ui/PostsList";
import { Suspense } from "react";
import ScrollUp from "../ui/ScrollUp";

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
    tag?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const tag = searchParams?.tag || "";

  return (
    <div className="flex flex-col min-h-screen w-full px-8 py-8 md:px-20 2xl:px-40 mt-20">
      <div className="w-full max-w-4xl mx-auto">
        {/* Search bar */}
        <SearchBar placeholder="Search by title" />
        <Suspense fallback={<TagsSkeleton />}>
          <Tags />
        </Suspense>
        <Suspense fallback={<PostsListSkeleton />}>
          <PostsList query={query} tag={tag} />
        </Suspense>
        <ScrollUp />
      </div>
    </div>
  );
}
