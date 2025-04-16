import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not signed in and trying to access protected routes (except homepage)
  if (
    !session &&
    !["/", "/sign-in", "/sign-up"].includes(req.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is signed in and trying to access auth pages
  if (session && ["/sign-in", "/sign-up"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
