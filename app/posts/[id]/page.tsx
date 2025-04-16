"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

type Post = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  skills_offered: string[];
  skills_wanted: string[];
  status: string;
  created_at: string;
  profiles: {
    email: string;
    bio: string;
    skills: string[];
    skills_to_learn: string[];
  };
};

type Conversation = {
  id: string;
  post_id: string;
  initiator_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
};

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: postData, error: postError } = await supabase
          .from("skill_swap_posts")
          .select(
            `
            *,
            profiles (
              email,
              bio,
              skills,
              skills_to_learn
            )
          `
          )
          .eq("id", params.id)
          .single();

        if (postError) throw postError;
        setPost(postData);

        if (postData.user_id !== user.id) {
          const { data: conversationData } = await supabase
            .from("conversations")
            .select("*")
            .eq("post_id", params.id)
            .eq("initiator_id", user.id)
            .single();

          setConversation(conversationData);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleStartConversation = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !post) return;

      const { data, error } = await supabase
        .from("conversations")
        .insert([
          {
            post_id: post.id,
            initiator_id: user.id,
            receiver_id: post.user_id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setConversation(data);
      router.push(`/messages/${data.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Post not found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            Posted by {post.profiles.email} on{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="mt-2 text-muted-foreground">{post.description}</p>
            </div>

            <div>
              <h3 className="font-semibold">Skills Offered</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {post.skills_offered.map((skill) => (
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
              <h3 className="font-semibold">Skills Wanted</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {post.skills_wanted.map((skill) => (
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
              <h3 className="font-semibold">About the Poster</h3>
              <p className="mt-2 text-muted-foreground">{post.profiles.bio}</p>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-4">
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              {conversation ? (
                <Link href={`/messages/${conversation.id}`}>
                  <Button>View Conversation</Button>
                </Link>
              ) : (
                <Button onClick={handleStartConversation}>
                  Start Conversation
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
