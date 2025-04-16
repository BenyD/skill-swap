"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

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

// Mock data for prototype
const mockCategories: SkillCategory[] = [
  { id: "1", name: "Programming" },
  { id: "2", name: "Languages" },
  { id: "3", name: "Music" },
  { id: "4", name: "Design" },
];

const mockSkills: Record<string, Skill[]> = {
  "1": [
    { id: "1", name: "JavaScript", category_id: "1" },
    { id: "2", name: "Python", category_id: "1" },
    { id: "3", name: "React", category_id: "1" },
    { id: "4", name: "TypeScript", category_id: "1" },
  ],
  "2": [
    { id: "5", name: "Spanish", category_id: "2" },
    { id: "6", name: "French", category_id: "2" },
    { id: "7", name: "Mandarin", category_id: "2" },
  ],
  "3": [
    { id: "8", name: "Guitar", category_id: "3" },
    { id: "9", name: "Piano", category_id: "3" },
    { id: "10", name: "Singing", category_id: "3" },
  ],
  "4": [
    { id: "11", name: "UI/UX", category_id: "4" },
    { id: "12", name: "Graphic Design", category_id: "4" },
    { id: "13", name: "Photography", category_id: "4" },
  ],
};

export default function ProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSkillsToLearn, setSelectedSkillsToLearn] = useState<string[]>(
    []
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile setup complete!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Profile Setup</h1>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself and your interests..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills You Have</label>
                  <Select
                    onValueChange={(value) =>
                      setSelectedSkills([...selectedSkills, value])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your skills" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSkills[selectedCategory]?.map((skill) => (
                        <SelectItem key={skill.id} value={skill.name}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Skills You Want to Learn
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setSelectedSkillsToLearn([
                        ...selectedSkillsToLearn,
                        value,
                      ])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skills to learn" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSkills[selectedCategory]?.map((skill) => (
                        <SelectItem key={skill.id} value={skill.name}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(selectedSkills.length > 0 ||
                  selectedSkillsToLearn.length > 0) && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Selected Skills
                    </label>
                    <div className="space-y-2">
                      {selectedSkills.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Your Skills:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedSkills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedSkillsToLearn.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Want to Learn:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedSkillsToLearn.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
