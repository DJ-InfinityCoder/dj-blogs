// import { NextResponse } from "next/server";

// export function middleware(request) {
//     const token = request.cookies.has("next-auth.session-token"); 
//     const path = request.nextUrl.pathname; 

//     if (token && (path === "/auth/login" || path === "/auth/signup")) {
//         return NextResponse.redirect(new URL("/dashboard/profile", request.url));
//     }

//     if (!token && path === "/dashboard/profile") {
//         return NextResponse.redirect(new URL("/auth/login", request.url));
//     }

//     return NextResponse.next(); 
// }

// export const config = {
//     matcher: [
//         "/dashboard",
//         "/auth/login",
//         "/auth/signup",
//         "/((?!_next/static|_next/image|favicon.ico|public/).*)",
//     ],
// };

// middleware.js
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token; // token from next-auth session

    // If user is logged in and tries to access login/signup → redirect to profile
    if (token && (pathname === "/auth/login" || pathname === "/auth/signup")) {
      return NextResponse.redirect(new URL("/dashboard/profile", req.url));
    }

    // If user is NOT logged in and tries to access protected profile → redirect to login
    if (!token && pathname === "/dashboard/profile") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // allow callback logic above to handle redirects
    },
  }
);

export const config = {
  matcher: [
    "/dashboard",
    "/auth/login",
    "/auth/signup",
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
