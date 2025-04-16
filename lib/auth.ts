import { supabase } from "@/lib/supabase";

export type AuthError = {
  message: string;
};

export async function signUp({
  email,
  password,
  name,
  username,
  bio,
}: {
  email: string;
  password: string;
  name: string;
  username: string;
  bio: string;
}) {
  try {
    // Check if environment variables are set
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error(
        "Supabase environment variables are not properly configured"
      );
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      // Handle specific error cases
      if (authError.message.includes("security purposes")) {
        throw new Error("Please wait a moment before trying again");
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error("No user data returned after signup");
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      bio,
    });

    if (profileError) {
      // If profile creation fails, we should delete the auth user
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error(
          "Failed to delete user after profile creation failed:",
          deleteError
        );
      }
      throw profileError;
    }

    return { user: authData.user, error: null };
  } catch (error) {
    console.error("Error during sign up:", error);

    // Handle different types of errors
    let errorMessage = "An error occurred during sign up";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = (error as { message: string }).message;
    }

    return {
      user: null,
      error: {
        message: errorMessage,
      },
    };
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
