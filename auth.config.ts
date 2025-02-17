import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuth = nextUrl.pathname.startsWith("/auth/blog");
      if (isAuth) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/auth/blog", nextUrl));
      }
      return true;
    },

    session({ session, user }) {
      if (user) {
        session.user.name = user.name || "Guest"; // Ensure user name exists
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
