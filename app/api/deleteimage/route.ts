import type { NextRequest } from "next/server";
import { deleteFileAuto } from "@/lib/actions";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  await deleteFileAuto();
  return new Response("File deleted successfully");
}
