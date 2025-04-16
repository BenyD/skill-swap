"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Profile = {
  id: string;
  email: string;
  bio: string;
  skills: string[];
  skills_to_learn: string[];
};

type SkillSwapPost = {
  id: string;
  title: string;
  description: string;
  skills_offered: string[];
  skills_wanted: string[];
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<SkillSwapPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        const { data: postsData } = await supabase
          .from("skill_swap_posts")
          .select("*")
          .order("created_at", { ascending: false });

        setPosts(postsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/create-post">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Manage your skills and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Skills You Have</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Skills You Want to Learn</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.skills_to_learn.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/profile">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              </div>
            ) : (
              <p>No profile data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Posts</CardTitle>
            <CardDescription>Manage your skill swap requests</CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg border p-4 hover:bg-accent/50"
                  >
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {post.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div>
                        <span className="text-sm font-medium">Offering:</span>
                        {post.skills_offered.map((skill) => (
                          <span
                            key={skill}
                            className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div>
                        <span className="text-sm font-medium">Wanting:</span>
                        {post.skills_wanted.map((skill) => (
                          <span
                            key={skill}
                            className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link href={`/posts/${post.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No posts yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
