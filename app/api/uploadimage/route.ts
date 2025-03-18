import { uploadFileAuto } from "@/lib/actions";

export async function GET() {
  await uploadFileAuto();
  return new Response("File uploaded successfully");
}
