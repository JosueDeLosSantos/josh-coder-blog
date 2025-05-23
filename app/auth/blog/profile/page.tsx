import { inter, poppins, oxanium } from "@/app/ui/fonts";
import { DateTime } from "luxon";
import Button from "@/app/ui/Button";
import ProfileImage from "@/app/ui/ProfileImage";
import Link from "next/link";
import FotoUploader from "@/app/ui/forms/FotoUploader";
import { auth } from "@/auth";
import { RiCake2Fill } from "react-icons/ri";
import { readingListCount } from "@/lib/actions";
// postgres
import { db } from "@vercel/postgres";

export default async function About() {
  const session = await auth();
  const pClient = await db.connect();
  const user = await pClient.query(`SELECT * FROM users WHERE email = $1`, [
    session?.user?.email,
  ]);
  pClient.release();
  const {
    name,
    bio,
    created_at,
  }: {
    name: string;
    bio: string | null;
    created_at: Date;
  } = user.rows[0];
  const date = DateTime.fromJSDate(created_at).toLocaleString({
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const readingListData = session?.user?.email
    ? await readingListCount(session.user.email)
    : "";

  return (
    <div className="flex flex-col min-h-screen max-sm:px-2 sm:px-6 pb-8 pt-48 md:px-20 2xl:px-40">
      <div className="relative bg-white border border-primaryBorder rounded-lg text-center px-8 md:px-16 pb-8 pt-16 mx-auto max-w-3xl max-sm:w-full sm:w-[600px]">
        <ProfileImage
          session={session}
          alt={name || "user name"}
          className="absolute bg-white -top-14 left-1/2 transform -translate-x-1/2 rounded-full ring-1 ring-primaryBorder"
          height={120}
          width={120}
        />
        <FotoUploader message="Profile image" />

        <div className="flex flex-col gap-8 pt-4">
          <div>
            <h1
              className={`${oxanium.className} text-2xl lg:text-4xl font-semibold`}
            >
              {name}
            </h1>
          </div>
          {/* bio */}
          <div className={`${inter.className}`}>
            {bio === null || bio === "" ? (
              <p className="text-textLight">
                You have no biography, edit your profile to be all set!
              </p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: bio }}></div>
            )}
          </div>
          <div>
            <Link href="/auth/blog/bookmarks">
              <div className="text-sm text-textLight hover:underline cursor-pointer">
                <span
                  className={`${poppins.className}`}
                >{`Reading list (${readingListData})`}</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-12">
          {/* Start date */}
          <div className="flex items-center justify-center gap-2 text-sm text-textLight">
            <RiCake2Fill className="size-5" />
            <span className={`${poppins.className}`}>
              {`Joined on ${date}`}
            </span>
          </div>
          <Link href="/auth/blog/profile/edit">
            <Button disabled={false} layout="form" type="button" bg="secondary">
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
