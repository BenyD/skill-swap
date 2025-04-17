"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMockData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function RequestPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = use(params);
  const router = useRouter();
  const { posts, addRequest, addChat } = useMockData();
  const post = posts.find((p) => p.id === postId);

  if (!post || !post.user) {
    return <div>Post not found</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    // Add the request
    addRequest({
      post_id: post.id,
      requester_id: post.user.id,
    });

    // Create a chat
    const chatId = addChat(post.id, post.user.id);

    toast.success("Request sent successfully!");
    router.push(`/messages/${chatId}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{post.user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{post.title}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Skills Offered:</h3>
              <div className="flex flex-wrap gap-2">
                {post.skills_offered.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Skills Wanted:</h3>
              <div className="flex flex-wrap gap-2">
                {post.skills_wanted.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Your Message:</h3>
                <Textarea
                  name="message"
                  placeholder="Write a message to introduce yourself and explain why you'd like to exchange skills..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">Send Request</Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
