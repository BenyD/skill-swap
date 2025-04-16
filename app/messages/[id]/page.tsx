"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for prototype
const mockMessages = [
  {
    id: "1",
    sender: {
      id: "1",
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
    },
    content: "Hey, I'm interested in learning Python!",
    timestamp: "2h ago",
  },
  {
    id: "2",
    sender: {
      id: "2",
      name: "You",
      avatar: "https://github.com/shadcn.png",
    },
    content:
      "Great! I'd be happy to help you learn Python. What's your current experience level?",
    timestamp: "1h ago",
  },
  {
    id: "3",
    sender: {
      id: "1",
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
    },
    content: "I'm a complete beginner. I've never programmed before.",
    timestamp: "30m ago",
  },
];

export default function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // In a real app, this would send the message to the server
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>Python Exchange</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender.name === "You" ? "justify-end" : ""
                  }`}
                >
                  {message.sender.name !== "You" && (
                    <Avatar>
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback>
                        {message.sender.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.sender.name === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
