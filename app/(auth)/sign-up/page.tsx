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
import { Progress } from "@/components/ui/progress";
import { signUp } from "@/lib/auth";
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

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    bio: "",
  });
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user, error } = await signUp(formData);

      if (error) {
        if (error.message.includes("security purposes")) {
          setError("Please wait a moment before trying again");
        } else {
          setError(error.message);
        }
        toast.error(error.message);
        return;
      }

      if (user) {
        toast.success("Please check your email to confirm your account!");
        router.push("/sign-in");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
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

          <motion.div variants={fadeInUp}>
            <Progress value={progress} className="h-1 bg-gray-700" />
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-4">
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
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-200">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-200">
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex justify-between space-x-2"
            >
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className={`ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 ${
                    loading ? "opacity-50" : ""
                  }`}
                  disabled={loading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className={`ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 ${
                    loading ? "opacity-50" : ""
                  }`}
                  disabled={loading}
                >
                  {loading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>
              )}
            </motion.div>
          </form>

          {error && (
            <motion.div
              variants={fadeInUp}
              className="text-sm text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}

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
