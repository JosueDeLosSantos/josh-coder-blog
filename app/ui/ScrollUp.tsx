"use client";

import { useEffect, useState } from "react";
import { FaAngleUp } from "react-icons/fa";
import clsx from "clsx";

export default function ScrollUp() {
  // Scrolls to the top of the page
  const isBrowser = () => typeof window !== "undefined"; //Next js recommends this approach

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    // Show the button when the user scrolls down
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={clsx(
        "bg-primary rounded-full p-3 flex items-center justify-center fixed bottom-4 right-4 text-white",
        {
          hidden: !isVisible,
        }
      )}
      onClick={scrollToTop}
    >
      <FaAngleUp className="text-3xl" />
    </button>
  );
}
