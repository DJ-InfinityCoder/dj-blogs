import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.has("next-auth.session-token"); 
    const path = request.nextUrl.pathname; 

    if (token && (path === "/auth/login" || path === "/auth/signup")) {
        return NextResponse.redirect(new URL("/dashboard/profile", request.url));
    }

    if (!token && path === "/dashboard/profile") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next(); 
}

export const config = {
    matcher: [
        "/dashboard",
        "/auth/login",
        "/auth/signup",
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};
