"use client";

import { useState } from "react";
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

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [currentSkillOffered, setCurrentSkillOffered] = useState("");
  const [currentSkillWanted, setCurrentSkillWanted] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddSkillOffered = () => {
    if (currentSkillOffered && !skillsOffered.includes(currentSkillOffered)) {
      setSkillsOffered([...skillsOffered, currentSkillOffered]);
      setCurrentSkillOffered("");
    }
  };

  const handleAddSkillWanted = () => {
    if (currentSkillWanted && !skillsWanted.includes(currentSkillWanted)) {
      setSkillsWanted([...skillsWanted, currentSkillWanted]);
      setCurrentSkillWanted("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("skill_swap_posts").insert([
        {
          user_id: user.id,
          title,
          description,
          skills_offered: skillsOffered,
          skills_wanted: skillsWanted,
        },
      ]);

      if (error) throw error;

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

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Skills You Can Offer
              </label>
              <div className="flex gap-2">
                <Input
                  value={currentSkillOffered}
                  onChange={(e) => setCurrentSkillOffered(e.target.value)}
                  placeholder="Add a skill"
                />
                <Button type="button" onClick={handleAddSkillOffered}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsOffered.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Skills You Want to Learn
              </label>
              <div className="flex gap-2">
                <Input
                  value={currentSkillWanted}
                  onChange={(e) => setCurrentSkillWanted(e.target.value)}
                  placeholder="Add a skill"
                />
                <Button type="button" onClick={handleAddSkillWanted}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsWanted.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
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
