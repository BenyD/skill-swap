import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const type = requestUrl.hash
    ? new URLSearchParams(requestUrl.hash.substring(1)).get("type")
    : null;

  // Handle email confirmation
  if (type === "signup" || type === "recovery") {
    return NextResponse.redirect(
      new URL("/email-confirmed", requestUrl.origin)
    );
  }

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
      // Check if this is a new user (email confirmation)
      const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("id", session.user.id)
        .single();

      if (!profile) {
        // This is a new user who just confirmed their email
        return NextResponse.redirect(
          new URL("/email-confirmed", requestUrl.origin)
        );
      }

      // Existing user, redirect to home
      return NextResponse.redirect(new URL("/", requestUrl.origin));
    }
  }

  // If no code is present or session is invalid, redirect to sign in
  return NextResponse.redirect(new URL("/sign-in", requestUrl.origin));
}
