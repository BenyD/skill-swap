"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function EmailConfirmation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const checkConfirmationStatus = async () => {
    setCheckLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setIsConfirmed(true);
        toast.success("Email confirmed successfully!");
        setTimeout(() => {
          router.push("/profile-setup");
        }, 2000);
      } else {
        toast.error("Email not confirmed yet. Please check your inbox.");
      }
    } catch (error) {
      console.error("Error checking confirmation status:", error);
      toast.error("Failed to check confirmation status. Please try again.");
    } finally {
      setCheckLoading(false);
    }
  };

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        setLoading(true);
        try {
          // First, try to get the current session
          const {
            data: { session },
          } = await supabase.auth.getSession();

          // If we don't have a session or the tokens are different, set the new session
          if (!session || session.access_token !== accessToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) throw error;
          }

          // Get the user's email
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user?.email) {
            setUserEmail(user.email);
            setIsConfirmed(true);
          }

          // Clear the hash from the URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          // Redirect to profile setup after a short delay to show the success state
          setTimeout(() => {
            router.push("/profile-setup");
          }, 2000);
        } catch (error) {
          console.error("Error setting session:", error);
          toast.error("Failed to confirm email. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        // If no tokens in URL, check if we're already confirmed
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
          if (user.email_confirmed_at) {
            setIsConfirmed(true);
            setTimeout(() => {
              router.push("/profile-setup");
            }, 2000);
          }
        }
      }
    };

    handleEmailConfirmation();
  }, [router]);

  const handleResendEmail = async () => {
    if (!userEmail) {
      toast.error("No email address found. Please try signing up again.");
      return;
    }

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: userEmail,
      });

      if (error) throw error;

      toast.success("Confirmation email resent!");
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while resending the email"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" />
      <motion.div
        className="w-full max-w-lg relative z-10"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <Card className="w-full space-y-6 p-8 bg-gray-800/50 border-gray-800 backdrop-blur-sm shadow-xl">
          <motion.div
            variants={fadeInUp}
            className="flex flex-col space-y-2 text-center"
          >
            <Badge
              variant="outline"
              className="w-fit mx-auto border-purple-500/20 bg-purple-500/10 text-purple-300 backdrop-blur-sm"
            >
              ✨ {isConfirmed ? "Email Confirmed!" : "Confirm Your Email"}
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {isConfirmed
                ? "Email confirmed successfully!"
                : loading
                ? "Confirming your email..."
                : "Check your inbox"}
            </h1>
            <p className="text-sm text-gray-400">
              {isConfirmed
                ? "Redirecting you to complete your profile..."
                : loading
                ? "Please wait while we confirm your email..."
                : "We've sent you an email with a confirmation link. Please check your inbox and click the link to verify your account."}
            </p>
          </motion.div>

          {!loading && !isConfirmed && (
            <>
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Icons.spinner className="h-8 w-8 animate-spin text-purple-400" />
                  <p className="text-sm text-gray-400">
                    Waiting for email confirmation...
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center space-y-4"
              >
                <Button
                  type="button"
                  onClick={checkConfirmationStatus}
                  disabled={checkLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600"
                >
                  {checkLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "I have confirmed my email"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={resendLoading || !userEmail}
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {resendLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend confirmation email"
                  )}
                </Button>
              </motion.div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
