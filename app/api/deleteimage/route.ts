import { deleteFileAuto } from "@/lib/actions";

export async function GET(request: Request) {
  await deleteFileAuto();
  return new Response("File deleted successfully");
}
