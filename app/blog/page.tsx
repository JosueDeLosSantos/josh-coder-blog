import SearchBar from "@/app/ui/Search";
import Tags from "@/app/ui/Tags";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full px-8 pt-8 pb-8 md:px-20 2xl:px-40">
      <div className="w-full">
        {/* Search bar */}
        <SearchBar placeholder="Search..." />
        <Tags />
      </div>
    </div>
  );
}
