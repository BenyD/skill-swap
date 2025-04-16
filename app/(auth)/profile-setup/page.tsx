"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Skill = {
  id: string;
  name: string;
  category_id: string;
};

type SkillCategory = {
  id: string;
  name: string;
};

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

export default function ProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillsOffered, setSelectedSkillsOffered] = useState<string[]>(
    []
  );
  const [selectedSkillsWanted, setSelectedSkillsWanted] = useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      if (!selectedCategory) return;

      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("category_id", selectedCategory)
        .order("name");

      if (error) {
        console.error("Error fetching skills:", error);
        return;
      }

      setSkills(data || []);
    };

    fetchSkills();
  }, [selectedCategory]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/sign-in");
        return;
      }

      // Check if user has already completed profile setup
      const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profile) {
        router.push("/");
        return;
      }
    };

    checkUser();
  }, [router]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Not authenticated");

      // Update user profile
      const { error: profileError } = await supabase
        .from("users")
        .update({
          full_name: formData.name,
          username: formData.username,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast.success("Profile setup complete!");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
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
              ✨ Complete Your Profile
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {step === 1
                ? "Tell us about yourself"
                : step === 2
                ? "What skills can you offer?"
                : "What skills do you want to learn?"}
            </h1>
            <p className="text-sm text-gray-400">
              {step === 1
                ? "Add a bio to help others get to know you"
                : step === 2
                ? "Select the skills you're comfortable teaching"
                : "Select the skills you'd like to learn from others"}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-4">
            {step === 1 && (
              <div className="space-y-2">
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                  className="min-h-[150px] bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                />
              </div>
            )}

            {(step === 2 || step === 3) && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">
                    Skill Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="bg-gray-900/50 border-gray-700 text-gray-200">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      {step === 2
                        ? "Skills You Can Offer"
                        : "Skills You Want to Learn"}
                    </label>
                    <Select
                      value={
                        step === 2
                          ? selectedSkillsOffered[0]
                          : selectedSkillsWanted[0]
                      }
                      onValueChange={(value) => {
                        if (step === 2) {
                          setSelectedSkillsOffered([value]);
                        } else {
                          setSelectedSkillsWanted([value]);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-gray-900/50 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select a skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {skills.map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
            {step < 3 ? (
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
                type="button"
                onClick={handleSubmit}
                className={`ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 ${
                  loading ? "opacity-50" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
