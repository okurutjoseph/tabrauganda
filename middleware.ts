import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth: { sessionClaims?: { metadata?: { role?: string } } }, req: { url: string }) {
    // Only users with admin role can access /admin routes
    if (req.url.includes('/admin')) {
      const isAdmin = auth.sessionClaims?.metadata?.role === 'admin';
      if (!isAdmin) {
        const homeUrl = new URL('/', req.url);
        return Response.redirect(homeUrl);
      }
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};