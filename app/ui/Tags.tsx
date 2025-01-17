//sanity
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/live";
import { PostType } from "@/app/types";
import { Tag } from "@/app/ui/Tag";

export default async function Tags() {
  const ALL_POSTS = defineQuery(`*[_type == "post"]`);
  const posts = await sanityFetch({ query: ALL_POSTS });
  const allTags: string[] = [];

  const tags: { name: string; amount: number }[] = [];
  if (posts) {
    posts.data.forEach((post: PostType) => {
      if (post.tag) {
        post.tag.forEach((tag: string) => {
          allTags.push(tag);
        });
      }
    });
  }

  const uniqueTags = new Set(allTags);

  uniqueTags.forEach((uniquetag) => {
    tags.push({
      name: uniquetag,
      amount: allTags.filter((tag) => tag === uniquetag).length,
    });
  });

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag: { name: string; amount: number }) => {
        return <Tag key={tag.name} name={tag.name} amount={tag.amount} />;
      })}
    </div>
  );
}
