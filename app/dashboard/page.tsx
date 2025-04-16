"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Skill = {
  name: string;
};

// Mock data for prototype
const mockUserSkills = ["JavaScript", "React", "TypeScript", "UI Design"];
const mockLearningSkills = ["Python", "Machine Learning", "Guitar"];
const mockPosts = [
  {
    id: "1",
    title: "Looking to exchange React skills for Python",
    description:
      "I'm an experienced React developer looking to learn Python. I can help you with React, TypeScript, and modern web development practices.",
    offering: ["React", "TypeScript", "Web Development"],
    wanting: ["Python", "Data Science"],
  },
  {
    id: "2",
    title: "Guitar lessons for Spanish practice",
    description:
      "I'm a professional guitarist looking to improve my Spanish. I can teach you guitar techniques and music theory in exchange for Spanish conversation practice.",
    offering: ["Guitar", "Music Theory"],
    wanting: ["Spanish", "Language Exchange"],
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button onClick={() => router.push("/create-post")}>
          Create New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Your Profile</h2>
              <p className="text-sm text-muted-foreground">
                Manage your skills and preferences
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills You Have</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockUserSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Skills You Want to Learn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mockLearningSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-1 text-sm font-medium text-secondary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push("/profile-setup")}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Your Posts</h2>
              <p className="text-sm text-muted-foreground">
                Manage your skill swap requests
              </p>

              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/posts/${post.id}`)}
                  >
                    <h3 className="font-medium mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {post.description}
                    </p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Offering:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.offering.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Wanting:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.wanting.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
