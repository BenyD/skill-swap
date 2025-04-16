"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillsOffered, setSelectedSkillsOffered] = useState<string[]>(
    []
  );
  const [selectedSkillsWanted, setSelectedSkillsWanted] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create the exchange request
      const { data: exchangeRequest, error: requestError } = await supabase
        .from("exchange_requests")
        .insert([
          {
            requester_id: user.id,
            offered_skill_id: selectedSkillsOffered[0], // For now, just use the first skill
            requested_skill_id: selectedSkillsWanted[0], // For now, just use the first skill
            status: "pending",
            message: description,
          },
        ])
        .select()
        .single();

      if (requestError) throw requestError;

      // Create user skills entries for offered skills
      const offeredSkillsPromises = selectedSkillsOffered.map((skillId) =>
        supabase.from("user_skills").insert({
          user_id: user.id,
          skill_id: skillId,
          proficiency_level: "intermediate", // Default value, can be made configurable
        })
      );

      // Create user learning goals entries for wanted skills
      const wantedSkillsPromises = selectedSkillsWanted.map((skillId) =>
        supabase.from("user_learning_goals").insert({
          user_id: user.id,
          skill_id: skillId,
          current_level: "none", // Default value
          target_level: "intermediate", // Default value, can be made configurable
        })
      );

      await Promise.all([...offeredSkillsPromises, ...wantedSkillsPromises]);

      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Skill Swap Post</CardTitle>
          <CardDescription>
            Share what skills you can offer and what you'd like to learn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Looking to exchange programming skills"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you're looking for and what you can offer..."
                required
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
                    {categories.map((category) => (
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
                    <label className="text-sm font-medium">
                      Skills You Can Offer
                    </label>
                    <Select
                      value={selectedSkillsOffered[0]}
                      onValueChange={(value) =>
                        setSelectedSkillsOffered([value])
                      }
                    >
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Skills You Want to Learn
                    </label>
                    <Select
                      value={selectedSkillsWanted[0]}
                      onValueChange={(value) =>
                        setSelectedSkillsWanted([value])
                      }
                    >
                      <SelectTrigger>
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
                </>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
