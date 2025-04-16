"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles: {
    email: string;
  };
};

type Conversation = {
  id: string;
  post_id: string;
  initiator_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  skill_swap_posts: {
    title: string;
  };
};

export default function MessagePage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: conversationData, error: conversationError } =
          await supabase
            .from("conversations")
            .select(
              `
            *,
            skill_swap_posts (
              title
            )
          `
            )
            .eq("id", params.id)
            .single();

        if (conversationError) throw conversationError;
        setConversation(conversationData);

        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select(
            `
            *,
            profiles (
              email
            )
          `
          )
          .eq("conversation_id", params.id)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

        // Subscribe to new messages
        const channel = supabase
          .channel(`messages:${params.id}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${params.id}`,
            },
            (payload) => {
              const newMessage = payload.new as Message;
              setMessages((prev) => [...prev, newMessage]);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !conversation) return;

      const { error } = await supabase.from("messages").insert([
        {
          conversation_id: conversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
        },
      ]);

      if (error) throw error;

      setNewMessage("");
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

  if (!conversation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Conversation not found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>
            About: {conversation.skill_swap_posts.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-[400px] overflow-y-auto rounded-lg border p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender_id === conversation.initiator_id
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-[80%] rounded-lg p-3 ${
                      message.sender_id === conversation.initiator_id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {message.profiles.email} •{" "}
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
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
