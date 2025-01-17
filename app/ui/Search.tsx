"use client";
import clsx from "clsx";
import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [barLength, setBarLength] = useState(0);

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    const hasTag = params.has("tag");
    if (term) {
      if (hasTag) {
        params.delete("tag");
      }
      params.set("query", term);
    } else {
      params.delete("query");
      if (hasTag) {
        params.delete("tag");
      }
    }
    replace(`${pathname}?${params.toString()}`);
    setBarLength(term.length);
  }

  return (
    <div className="relative">
      <input
        type="text"
        maxLength={100}
        placeholder={placeholder}
        className="w-full border-solid border pl-10 pr-16 py-1 border-primaryLight outline-none focus-visible:ring-1 focus-visible:ring-primaryLight text-textLight rounded"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <HiMagnifyingGlass className="absolute top-0 left-0 z-10 text-2xl ml-2 mt-1 text-primaryLight" />
      <div className="absolute top-0 right-0 mr-2 mt-1">
        <span
          className={clsx(
            "text-xs",
            { "text-secondaryDark": barLength === 100 },
            { "text-textLight": barLength < 100 }
          )}
        >{`${barLength} / 100`}</span>
      </div>
    </div>
  );
}
