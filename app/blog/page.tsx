import SearchBar from "@/app/ui/Search";
import Tags from "@/app/ui/Tags";
import PostsList from "@/app/ui/PostsList";
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
    <div className="flex flex-col min-h-screen w-full px-8 pt-8 pb-8 md:px-20 2xl:px-40">
      <div className="w-full max-w-4xl mx-auto">
        {/* Search bar */}
        <SearchBar placeholder="Search by title" />
        <Tags />
        <Suspense fallback={<div>Loading...</div>}>
          <PostsList query={query} tag={tag} />
        </Suspense>
        <ScrollUp />
      </div>
    </div>
  );
}
