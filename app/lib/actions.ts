"use server";

import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";

export async function getPosts() {
  const ALL_POSTS = defineQuery(`*[_type == "post"]`);
  const data = await client.fetch(ALL_POSTS);
  return data;
}
