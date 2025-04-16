"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { signIn } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

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

export default function SignIn() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await signIn(formData);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (user) {
        // Check if user has completed profile setup
        const { data: profile } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!profile) {
          // First time signing in, redirect to profile setup
          toast.success("Welcome! Let's set up your profile.");
          router.push("/profile-setup");
        } else {
          // Existing user, redirect to dashboard
          toast.success("Signed in successfully!");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
              ✨ Welcome Back
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sign in to your account
            </h1>
            <p className="text-sm text-gray-400">
              Continue your journey of skill exchange
            </p>
          </motion.div>

          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
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
                className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
              />
            </div>

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
              Sign In
            </Button>
          </motion.form>

          <motion.p
            variants={fadeInUp}
            className="text-center text-sm text-gray-400"
          >
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
            >
              Sign up
            </Link>
          </motion.p>
        </Card>
      </motion.div>
    </div>
  );
}
