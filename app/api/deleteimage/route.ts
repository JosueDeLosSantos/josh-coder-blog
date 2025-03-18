import { deleteFileAuto } from "@/lib/actions";

export async function GET() {
  await deleteFileAuto();
  return new Response("File deleted successfully");
}
