"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for prototype
const mockUserSkills = ["JavaScript", "React", "TypeScript", "UI Design"];
const mockLearningSkills = ["Python", "Machine Learning", "Guitar"];
const mockUserPosts = [
  {
    id: "1",
    title: "Looking to exchange React skills for Python",
    description:
      "I'm an experienced React developer looking to learn Python. I can help you with React, TypeScript, and modern web development practices.",
    skills_offered: ["React", "TypeScript", "Web Development"],
    skills_wanted: ["Python", "Data Science"],
    status: "active",
    created_at: "2024-04-17",
  },
];

const mockOtherPosts = [
  {
    id: "2",
    title: "Guitar lessons for Spanish practice",
    description:
      "I'm a professional guitarist looking to improve my Spanish. I can teach you guitar techniques and music theory in exchange for Spanish conversation practice.",
    skills_offered: ["Guitar", "Music Theory"],
    skills_wanted: ["Spanish", "Language Exchange"],
    status: "active",
    created_at: "2024-04-16",
    user: {
      name: "Alex Johnson",
      avatar: "https://github.com/shadcn.png",
    },
  },
  {
    id: "3",
    title: "Cooking lessons for Photography skills",
    description:
      "I'm a chef looking to improve my photography skills. I can teach you cooking techniques and recipes in exchange for photography lessons.",
    skills_offered: ["Cooking", "Recipe Development"],
    skills_wanted: ["Photography", "Photo Editing"],
    status: "active",
    created_at: "2024-04-15",
    user: {
      name: "Maria Garcia",
      avatar: "https://github.com/shadcn.png",
    },
  },
];

const mockPendingRequests = [
  {
    id: "1",
    post_id: "1",
    requester_id: "user2",
    status: "pending",
    created_at: "2024-04-17T10:00:00Z",
    user: {
      name: "John Smith",
      avatar: "https://github.com/shadcn.png",
    },
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<
    (typeof mockOtherPosts)[0] | null
  >(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<
    (typeof mockPendingRequests)[0] | null
  >(null);

  const handleRequestSkillSwap = () => {
    toast.success("Skill swap request sent!");
    setShowRequestDialog(false);
    // In a real app, this would update the UI to show the request was sent
    const updatedPosts = mockOtherPosts.filter(
      (post) => post.id !== selectedPost?.id
    );
    mockOtherPosts.splice(0, mockOtherPosts.length, ...updatedPosts);
  };

  const handleAcceptRequest = () => {
    toast.success("Request accepted! Starting conversation...");
    setShowAcceptDialog(false);
    // In a real app, this would update the UI to show the request was accepted
    const updatedRequests = mockPendingRequests.filter(
      (request) => request.id !== selectedRequest?.id
    );
    mockPendingRequests.splice(
      0,
      mockPendingRequests.length,
      ...updatedRequests
    );
    router.push("/messages/1");
  };

  const handleRejectRequest = () => {
    toast.info("Request rejected");
    setShowAcceptDialog(false);
    // In a real app, this would update the UI to show the request was rejected
    const updatedRequests = mockPendingRequests.filter(
      (request) => request.id !== selectedRequest?.id
    );
    mockPendingRequests.splice(
      0,
      mockPendingRequests.length,
      ...updatedRequests
    );
  };

  const handleEditProfile = () => {
    setShowProfileDialog(true);
  };

  const handleCreatePost = () => {
    router.push("/create-post");
  };

  const handleViewPost = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button
          onClick={handleCreatePost}
          className="bg-primary hover:bg-primary/90"
        >
          Create New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile and Requests */}
        <div className="space-y-6 lg:col-span-1">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <span>Your Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Skills You Have</h3>
                <div className="flex flex-wrap gap-2">
                  {mockUserSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  Skills You Want to Learn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockLearningSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Pending Requests */}
          {mockPendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-4">
                    {mockPendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar>
                            <AvatarImage src={request.user.avatar} />
                            <AvatarFallback>
                              {request.user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {request.user.name}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Wants to exchange skills with you!
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowAcceptDialog(true);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Posts */}
        <div className="space-y-6 lg:col-span-2">
          {/* Your Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Your Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUserPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleViewPost(post.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{post.title}</h3>
                      <Badge variant="outline">{post.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {post.description}
                    </p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Offering:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.skills_offered.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Wanting:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.skills_wanted.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Skill Swaps */}
          <Card>
            <CardHeader>
              <CardTitle>Available Skill Swaps</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {mockOtherPosts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar>
                          <AvatarImage src={post.user.avatar} />
                          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            Posted by {post.user.name} on {post.created_at}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {post.description}
                      </p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Offering:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.skills_offered.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Wanting:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.skills_wanted.map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowPostDetails(true);
                            setSelectedPost(post);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPost(post);
                            setShowRequestDialog(true);
                          }}
                        >
                          Request Swap
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Skill Swap</DialogTitle>
            <DialogDescription>
              Are you sure you want to request a skill swap with{" "}
              {selectedPost?.user.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRequestDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRequestSkillSwap}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accept Request Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Skill Swap Request</DialogTitle>
            <DialogDescription>
              {selectedRequest?.user.name} wants to exchange skills with you.
              Accepting this request will start a conversation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleRejectRequest}>
              Reject
            </Button>
            <Button onClick={handleAcceptRequest}>Accept Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your skills and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Skills You Have</h3>
              <div className="flex flex-wrap gap-2">
                {mockUserSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">
                Skills You Want to Learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {mockLearningSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProfileDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Profile updated!");
                setShowProfileDialog(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
