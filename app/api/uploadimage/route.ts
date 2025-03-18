import { uploadFileAuto } from "@/lib/actions";

export async function GET(request: Request) {
  await uploadFileAuto();
  return new Response("File uploaded successfully");
}
