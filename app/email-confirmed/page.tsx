"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

export default function EmailConfirmed() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSession = async () => {
      try {
        // First check if we have tokens in the URL
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const type = params.get("type");

        if (access_token && refresh_token) {
          // Set the session with the tokens
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) throw error;

          // Clear the hash from the URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          if (type === "signup") {
            toast.success("Email confirmed successfully!");
          }
        }

        // Check if we have a session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log("Session established after email confirmation");
        }
      } catch (error) {
        console.error("Error handling session:", error);
        toast.error("There was an error confirming your email");
      } finally {
        setIsLoading(false);
      }
    };

    handleSession();
  }, []);

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
            className="flex flex-col items-center space-y-4 text-center"
          >
            <Badge
              variant="outline"
              className="w-fit border-green-500/20 bg-green-500/10 text-green-300 backdrop-blur-sm"
            >
              ✨ Email Confirmed!
            </Badge>
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <Icons.mail className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-green-400 via-green-400 to-green-400 bg-clip-text text-transparent">
              Email Confirmed Successfully!
            </h1>
            <p className="text-gray-400">
              Your email has been verified. Please sign in to continue setting
              up your profile.
            </p>
            {!isLoading && (
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Sign In
              </Link>
            )}
            {isLoading && (
              <div className="flex items-center justify-center">
                <Icons.spinner className="h-6 w-6 animate-spin text-green-400" />
              </div>
            )}
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
