import { useEffect, useState } from "react";
import { getPosts } from "@/app/lib/actions";
import { PostType } from "@/app/types";

export default function usePostsFetch() {
  const [posts, setPosts] = useState<PostType[]>([]);
  useEffect(() => {
    async function fetchPosts() {
      const data = await getPosts();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return posts;
}
