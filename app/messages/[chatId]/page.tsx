"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMockData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);
  const router = useRouter();
  const { chats, currentUser, addMessage } = useMockData();
  const chat = chats.find((c) => c.id === chatId);

  if (!chat) {
    return <div>Chat not found</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get("message") as string;

    if (content.trim()) {
      addMessage(chat.id, content);
      e.currentTarget.reset();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                ←
              </Button>
              <CardTitle>Chat</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4 h-[400px] overflow-y-auto p-4">
              {chat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender_id === currentUser.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {format(new Date(message.created_at), "h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Textarea
                name="message"
                placeholder="Type your message..."
                className="flex-1"
                required
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
