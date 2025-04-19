"use client";

import { IoClose } from "react-icons/io5";
import Logo from "./Logo";
import Button, { DismissButton } from "./Button";
import { inter, poppins } from "./fonts";
import { useRouter } from "next/navigation";

export default function LoginAlert({
  slug,
  handleClose,
}: {
  slug: string;
  handleClose: () => void;
}) {
  const router = useRouter();

  const handleLogin = () => {
    router.push(`/login/${slug}`);
  };
  const handleSignup = () => {
    router.push(`/signUp/${slug}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg flex flex-col items-center justify-center max-lg:w-5/6 lg:w-3/6">
        <div className="flex justify-between rounded-t-lg items-center w-full p-4 border-b">
          <div className={`${poppins.className} text-text font-semibold`}>
            Log in to continue
          </div>
          <button
            onClick={() => handleClose()}
            className="text-textMild hover:text-primaryLight hover:bg-blogBg"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>
        <div className="p-4">
          <Logo />
        </div>
        <div
          className={`${inter.className} text-textLight p-4 text-center max-sm:text-sm`}
        >
          <span>
            {`This is a place where coders explore, stay up-to-date and grow their careers.`}
          </span>
        </div>
        <div className="flex flex-col gap-4 p-4 w-fit">
          <div onClick={() => handleLogin()} className="w-full">
            <Button
              fullWidth={true}
              disabled={false}
              type="button"
              layout="form"
              bg="primary"
            >
              Log in
            </Button>
          </div>

          <div onClick={() => handleSignup()} className="w-full">
            <DismissButton chat={false}>Create account</DismissButton>
          </div>
        </div>
      </div>
    </div>
  );
}
