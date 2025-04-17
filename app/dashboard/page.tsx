"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMockData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, posts, requests, updateRequest } = useMockData();
  const [activeTab, setActiveTab] = useState<"posts" | "requests">("posts");

  const handleRequest = (postId: string) => {
    toast.success("Request sent successfully!");
    router.push("/messages");
  };

  const handleAcceptRequest = (requestId: string) => {
    updateRequest(requestId, "accepted");
    toast.success("Request accepted! You can now message the user.");
    router.push("/messages");
  };

  const handleRejectRequest = (requestId: string) => {
    updateRequest(requestId, "rejected");
    toast.error("Request rejected");
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentUser.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Skills to Learn</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.skills_to_learn.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === "posts" ? "default" : "ghost"}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </Button>
        <Button
          variant={activeTab === "requests" ? "default" : "ghost"}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </Button>
      </div>

      {/* Posts Section */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Exchanges</h2>
            <Button onClick={() => router.push("/create-post")}>
              Create New Post
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={post.user?.avatar} />
                      <AvatarFallback>
                        {post.user?.name[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {post.user?.name || "You"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{post.description}</p>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-semibold">Offering:</h4>
                      <div className="flex flex-wrap gap-1">
                        {post.skills_offered.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Looking for:</h4>
                      <div className="flex flex-wrap gap-1">
                        {post.skills_wanted.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {post.user && (
                    <Button
                      className="w-full mt-4"
                      onClick={() => router.push(`/request/${post.id}`)}
                    >
                      Request Exchange
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Requests Section */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Pending Requests</h2>
          <div className="grid gap-4">
            {requests
              .filter((request) => request.status === "pending")
              .map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={request.user.avatar} />
                        <AvatarFallback>{request.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{request.user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Requested to exchange skills
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
