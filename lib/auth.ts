import { supabase } from "@/lib/supabase";

export type AuthError = {
  message: string;
};

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        }/email-confirmed`,
        data: {
          email_confirmed_at: null,
        },
      },
    });

    if (error) {
      throw error;
    }

    // If signup is successful but email needs confirmation
    if (data.user && !data.session) {
      return { user: data.user, error: null, needsConfirmation: true };
    }

    return { user: data.user, error: null, needsConfirmation: false };
  } catch (error) {
    console.error("Signup error:", error);
    return { user: null, error, needsConfirmation: false };
  }
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error("Error during sign in:", error);
    return {
      user: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during sign in",
      },
    };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error) {
    console.error("Error during sign out:", error);
    return {
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during sign out",
      },
    };
  }
}
