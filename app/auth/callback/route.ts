import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(new URL("/sign-in", requestUrl.origin));
    }

    if (session?.user) {
      // Check if user has completed profile setup
      const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("id", session.user.id)
        .single();

      if (!profile) {
        // User hasn't completed profile setup, redirect to profile setup
        return NextResponse.redirect(
          new URL("/profile-setup", requestUrl.origin)
        );
      }

      // User has completed profile setup, redirect to home
      return NextResponse.redirect(new URL("/", requestUrl.origin));
    }
  }

  // If no code is present or session is invalid, redirect to sign in
  return NextResponse.redirect(new URL("/sign-in", requestUrl.origin));
}
