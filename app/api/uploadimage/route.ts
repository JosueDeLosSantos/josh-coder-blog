import type { NextRequest } from "next/server";
import { uploadFileAuto } from "@/lib/actions";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  await uploadFileAuto();
  return new Response("File uploaded successfully");
}
