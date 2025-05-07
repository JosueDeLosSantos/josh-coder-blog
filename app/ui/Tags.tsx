import { PostType } from "@/app/types";
import { Tag } from "@/app/ui/Tag";
import { ReadingListType } from "@/lib/definitions";
//sanity
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/live";

export default async function Tags() {
  const ALL_POSTS = defineQuery(`*[_type == "post"]`);
  const posts = await sanityFetch({ query: ALL_POSTS });
  const allTags: string[] = [];

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

  const tags: { name: string; amount: number }[] = [];

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

export async function BookMarkedTags({
  readingList,
}: {
  readingList: ReadingListType[];
}) {
  const allTags: string[] = [];

  if (readingList.length > 0) {
    readingList.forEach((item: ReadingListType) => {
      if (item.tags) {
        item.tags.forEach((tag: string) => {
          allTags.push(tag);
        });
      }
    });
  }

  const uniqueTags = new Set(allTags);

  const tags: { name: string; amount: number }[] = [];

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
