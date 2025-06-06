import { getFeaturedPosts } from "@/lib/actions";
import Link from "next/link";
import { inter, poppins } from "@/app/ui/fonts";

export async function FeaturedPosts() {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const posts = await getFeaturedPosts();

  return (
    <div className="flex flex-wrap justify-center gap-5 2xl:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-md:mt-8 md:mt-10 w-fit mx-auto">
      {posts.map((post) => (
        <Link
          key={post.post_id}
          href={`/blog/${encodeURIComponent(post.slug)}`}
        >
          <div className="flex flex-col gap-2 bg-white max-w-80 h-full min-h-64 p-4 shadow-md rounded-lg cursor-default">
            <div
              className={`${poppins.className} text-text font-semibold max-md:text-lg md:text-xl`}
            >
              <h3>{post.title}</h3>
            </div>
            <div className={`${inter.className} text-textLight`}>
              <p>{post.description}</p>
            </div>
            <div
              className={`${poppins.className} text-secondary cursor-pointer`}
            >
              Read More
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function FeaturedPostsSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-5 2xl:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-md:mt-8 md:mt-10 w-fit mx-auto">
      {[...Array(6)].map((_, i) => (
        <div
          key={`fp-${i}`}
          className="flex flex-col gap-2 bg-white w-80 h-full min-h-64 p-4 shadow-md rounded-lg cursor-default"
        >
          <div className="animate-pulse">
            <div className="h-7 w-full bg-text rounded-full mb-4 opacity-50" />
            <div className="flex flex-col gap-2">
              {[...Array(8)].map((_, j) => (
                <div
                  key={`${i}-${j}`}
                  className="h-4 w-full bg-textLight rounded-full opacity-50"
                />
              ))}
              <div
                key={`${i}-9`}
                className="h-4 w-1/2 bg-textLight rounded-full opacity-50"
              />
            </div>
            <div
              key={`${i}-10`}
              className="mt-4 h-5 w-28 bg-secondary rounded-full opacity-50"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
