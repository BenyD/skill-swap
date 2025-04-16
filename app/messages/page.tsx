"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for prototype
const mockConversations = [
  {
    id: "1",
    user: {
      id: "1",
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
    },
    lastMessage: "Hey, I'm interested in learning Python!",
    timestamp: "2h ago",
    unread: true,
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "Jane Smith",
      avatar: "https://github.com/shadcn.png",
    },
    lastMessage: "Thanks for the help with React!",
    timestamp: "1d ago",
    unread: false,
  },
  {
    id: "3",
    user: {
      id: "3",
      name: "Mike Johnson",
      avatar: "https://github.com/shadcn.png",
    },
    lastMessage: "When are you available for a session?",
    timestamp: "3d ago",
    unread: false,
  },
];

export default function MessagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = mockConversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Messages</h1>
        <Button onClick={() => router.push("/messages/new")}>
          New Message
        </Button>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/messages/${conversation.id}`)}
              >
                <Avatar>
                  <AvatarImage src={conversation.user.avatar} />
                  <AvatarFallback>
                    {conversation.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium truncate">
                      {conversation.user.name}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
