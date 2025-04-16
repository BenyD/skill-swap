"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signUp } from "@/lib/auth";

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

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error, needsConfirmation } = await signUp(
        formData.email,
        formData.password
      );

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error(
            "An account with this email already exists. Please sign in."
          );
          router.push("/sign-in");
          return;
        }
        throw error;
      }

      if (needsConfirmation) {
        toast.success("Please check your email to confirm your account!");
        router.push("/email-confirmation");
        return;
      }

      if (user) {
        router.push("/profile-setup");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during signup"
      );
    } finally {
      setLoading(false);
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
              ✨ Join Skill Swap
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Create an account
            </h1>
            <p className="text-sm text-gray-400">
              Start your journey of skill exchange today
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 ${
                  loading ? "opacity-50" : ""
                }`}
                disabled={loading}
              >
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </motion.div>
          </form>

          <motion.p
            variants={fadeInUp}
            className="text-center text-sm text-gray-400"
          >
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
            >
              Sign in
            </Link>
          </motion.p>
        </Card>
      </motion.div>
    </div>
  );
}
