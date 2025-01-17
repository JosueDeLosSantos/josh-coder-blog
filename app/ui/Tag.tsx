"use client";

import clsx from "clsx";
import { poppins } from "@/app/ui/fonts";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function Tag({ name, amount }: { name: string; amount: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    const hasQuery = params.has("query");
    if (term) {
      if (hasQuery) {
        params.delete("query");
      }
      params.set("tag", term);
    } else {
      params.delete("tag");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex" onClick={() => handleSearch(name)}>
      <div
        className={clsx(
          poppins.className,
          "text-primaryLight max-sm:text-sm border border-primaryLight px-2 rounded-l-sm"
        )}
      >
        {name}
      </div>
      <div className="text-white bg-primaryLight px-2 rounded-r-sm">
        {amount}
      </div>
    </div>
  );
}
