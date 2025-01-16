import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "owu8u3pa",
  dataset: "production",
  apiVersion: "2025-01-16",
  useCdn: false,
});
