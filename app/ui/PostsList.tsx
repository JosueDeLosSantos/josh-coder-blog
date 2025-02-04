import { PostType } from "@/app/types";
import Post from "@/app/ui/Post";
import Link from "next/link";

export default async function PostsList({
  data,
  query,
  tag,
}: {
  data: PostType[];
  query: string;
  tag: string;
}) {
  const posts: PostType[] = data;
  let filteredPosts: PostType[] = [];

  // Searches for posts that match the tag
  if (tag.length > 0) {
    filteredPosts = posts.filter((post) => {
      return post.tag.includes(tag);
    });
  }

  // Searches for posts that match the tag
  if (query.length > 0) {
    filteredPosts = posts.filter((post) => {
      return post.title.toLowerCase().includes(query.toLowerCase());
    });
  }

  return (
    <div className="flex flex-col justify-center max-2xl:gap-5 2xl:gap-6 max-md:mt-8 md:mt-10">
      {filteredPosts.length > 0 &&
        filteredPosts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${encodeURIComponent(post.slug.current)}`}
          >
            <Post post={post} />
          </Link>
        ))}
      {filteredPosts.length === 0 &&
        posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${encodeURIComponent(post.slug.current)}`}
          >
            <Post post={post} />
          </Link>
        ))}
    </div>
  );
}
