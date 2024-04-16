import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/assets/images/logo.svg",
    "/events/:id",
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
    "/api/uploadthing",
    "/assets/images/dotted-pattern.png",
  ],
  ignoredRoutes: ["/api/webhooks/stripe", "/api/uploadthing"],
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
