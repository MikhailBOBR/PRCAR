import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (!token) {
        return false;
      }

      if (pathname.startsWith("/admin")) {
        return token.role === "ADMIN";
      }

      if (pathname.startsWith("/manager")) {
        return token.role === "MANAGER" || token.role === "ADMIN";
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/account/:path*", "/favorites/:path*", "/manager/:path*", "/admin/:path*"],
};
