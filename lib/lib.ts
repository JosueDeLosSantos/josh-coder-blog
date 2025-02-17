"use server";

import { auth } from "@/auth";

export async function session() {
  const response = await auth();
  return response;
}
