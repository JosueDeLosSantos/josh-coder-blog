"use server";

import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { Post } from "@/app/types";

export async function getPosts(): Promise<Post[]> {
  const ALL_POSTS = defineQuery(`*[_type == "post"]`);
  const data = await client.fetch(ALL_POSTS);
  return data;
}
