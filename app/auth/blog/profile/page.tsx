import { inter, poppins } from "@/app/ui/fonts";
import { DateTime } from "luxon";
import Image from "next/image";
import Button from "@/app/ui/Button";
// import FotoUploader from "@/app/ui/forms/FotoUploader";
import { auth } from "@/auth";
// postgres
import { db } from "@vercel/postgres";

export default async function About() {
  const session = await auth();
  const pClient = await db.connect();
  const user = await pClient.query(`SELECT * FROM users WHERE email = $1`, [
    session?.user?.email,
  ]);
  const {
    name,
    bio,
    image,
    created_at,
  }: { name: string; bio: string; image: string; created_at: Date } =
    user.rows[0];
  const date = DateTime.fromJSDate(created_at).toLocaleString({
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // const profilePic = {
  //   src: "/profile.png",
  //   file: undefined,
  //   trash: undefined,
  // };

  return (
    <div className="flex flex-col min-h-screen max-sm:px-2 sm:px-6 pb-8 pt-48 md:px-20 2xl:px-40">
      <div className="relative bg-white border border-primaryBorder rounded-lg text-center px-8 md:px-16 pb-8 pt-20 mx-auto max-w-3xl max-sm:w-full sm:w-[600px]">
        <Image
          src={image || "/profile.png"}
          alt={name || "user name"}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 rounded-full ring-1 ring-primaryBorder"
          height="120"
          width="120"
        />
        {/* <FotoUploader profilePic={profilePic} /> */}
        <div>
          <h1 className={`${poppins.className} text-2xl font-semibold  mb-8`}>
            {name}
          </h1>
          {/*  {author?.about ? (
            <div className={`${inter.className} text-text text-left`}>
              <PortableText value={author.about} components={components} />
            </div>
          ) : null} */}
        </div>
        <Button disabled={false} layout="form" type="button" bg="secondary">
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
