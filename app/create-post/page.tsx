"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSkillsOffered, setSelectedSkillsOffered] = useState<string[]>(
    []
  );
  const [selectedSkillsWanted, setSelectedSkillsWanted] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Create New Post</h1>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Looking to exchange programming skills"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you're looking for and what you can offer..."
              required
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
                  <label className="text-sm font-medium">
                    Skills You Can Offer
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setSelectedSkillsOffered([
                        ...selectedSkillsOffered,
                        value,
                      ])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skills to offer" />
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
                      setSelectedSkillsWanted([...selectedSkillsWanted, value])
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

                {(selectedSkillsOffered.length > 0 ||
                  selectedSkillsWanted.length > 0) && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Selected Skills
                    </label>
                    <div className="space-y-2">
                      {selectedSkillsOffered.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Offering:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedSkillsOffered.map((skill) => (
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
                      {selectedSkillsWanted.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Wanting:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedSkillsWanted.map((skill) => (
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

          {error && <p className="text-sm text-destructive">{error}</p>}

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
      </div>
    </div>
  );
}
