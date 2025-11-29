// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/",                     // الصفحة الرئيسية مفتوحة للكل
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api(.*)"               // لو عندك أي API routes عامة
  ]
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)", // كل الصفحات عادي
    "/", 
    "/(api|trpc)(.*)"
  ],
};