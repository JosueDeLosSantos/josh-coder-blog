export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full px-8 pt-8 pb-8 md:px-20 2xl:px-40">
      <div className="w-full">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full border-solid border px-2 py-1 border-primaryLight outline-none focus-visible:ring-1 focus-visible:ring-primaryLight rounded"
        />
      </div>
    </div>
  );
}
