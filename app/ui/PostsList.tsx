import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/live";
import { PostType } from "@/app/types";
import Post from "@/app/ui/Post";

export default async function PostsList({
  query,
  tag,
}: {
  query: string;
  tag: string;
}) {
  const ALL_POSTS = defineQuery(`*[_type == "post"]`);
  const data = await sanityFetch({ query: ALL_POSTS });
  const posts: PostType[] = data.data;
  let filteredPosts: PostType[] = [];
  // Searches for posts that match the tag
  if (tag.length > 0) {
    filteredPosts = posts.filter((post) => {
      return post.tag.includes(tag);
    });
  }

  return (
    <div className="flex flex-col justify-center max-2xl:gap-5 2xl:gap-6 max-md:mt-8 md:mt-10">
      {filteredPosts.length > 0 &&
        filteredPosts.map((post) => <Post key={post._id} post={post} />)}
      {filteredPosts.length === 0 &&
        posts.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
}
