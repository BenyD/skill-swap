import { create } from "zustand";

type Skill = {
  name: string;
};

type Post = {
  id: string;
  title: string;
  description: string;
  skills_offered: string[];
  skills_wanted: string[];
  status: string;
  created_at: string;
  user?: {
    name: string;
    avatar: string;
  };
};

type User = {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  skills_to_learn: string[];
};

type Request = {
  id: string;
  post_id: string;
  requester_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  user: {
    name: string;
    avatar: string;
  };
};

type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type Chat = {
  id: string;
  post_id: string;
  participants: string[];
  messages: Message[];
  created_at: string;
};

interface MockDataStore {
  currentUser: User;
  posts: Post[];
  requests: Request[];
  chats: Chat[];
  addPost: (post: Omit<Post, "id" | "created_at" | "status">) => void;
  addRequest: (request: Omit<Request, "id" | "created_at" | "status">) => void;
  updateRequest: (requestId: string, status: Request["status"]) => void;
  addChat: (postId: string, otherUserId: string) => string;
  addMessage: (chatId: string, content: string) => void;
}

export const useMockData = create<MockDataStore>((set) => ({
  currentUser: {
    id: "user1",
    name: "You",
    avatar: "https://github.com/shadcn.png",
    skills: ["JavaScript", "React", "TypeScript", "UI Design"],
    skills_to_learn: ["Python", "Machine Learning", "Guitar"],
  },
  posts: [
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
    {
      id: "4",
      title: "Data Science mentoring for UI/UX Design",
      description:
        "I'm a data scientist with 5 years of experience. Looking to improve my UI/UX design skills in exchange for data science mentoring.",
      skills_offered: ["Python", "Machine Learning", "Data Analysis"],
      skills_wanted: ["UI Design", "UX Research", "Figma"],
      status: "active",
      created_at: "2024-04-14",
      user: {
        name: "David Chen",
        avatar: "https://github.com/shadcn.png",
      },
    },
    {
      id: "5",
      title: "Yoga instruction for Web Development",
      description:
        "Certified yoga instructor offering private lessons in exchange for web development guidance. I can help with flexibility, strength, and mindfulness.",
      skills_offered: ["Yoga", "Meditation", "Breathing Techniques"],
      skills_wanted: ["HTML", "CSS", "JavaScript"],
      status: "active",
      created_at: "2024-04-13",
      user: {
        name: "Sarah Wilson",
        avatar: "https://github.com/shadcn.png",
      },
    },
    {
      id: "6",
      title: "Spanish tutoring for Graphic Design",
      description:
        "Native Spanish speaker offering language lessons in exchange for graphic design help. I can help with conversation, grammar, and cultural insights.",
      skills_offered: ["Spanish", "Language Teaching"],
      skills_wanted: ["Graphic Design", "Adobe Illustrator", "Photoshop"],
      status: "active",
      created_at: "2024-04-12",
      user: {
        name: "Carlos Rodriguez",
        avatar: "https://github.com/shadcn.png",
      },
    },
    {
      id: "7",
      title: "Music Production for Video Editing",
      description:
        "Experienced music producer looking to learn video editing. I can help with music production, mixing, and mastering in exchange for video editing skills.",
      skills_offered: ["Music Production", "Ableton Live", "Sound Design"],
      skills_wanted: ["Video Editing", "Premiere Pro", "After Effects"],
      status: "active",
      created_at: "2024-04-11",
      user: {
        name: "Jamie Lee",
        avatar: "https://github.com/shadcn.png",
      },
    },
    {
      id: "8",
      title: "Looking to exchange TypeScript skills for Rust",
      description:
        "I'm a TypeScript developer looking to learn Rust. I can help with TypeScript, Node.js, and backend development in exchange for Rust mentoring.",
      skills_offered: ["TypeScript", "Node.js", "Backend Development"],
      skills_wanted: ["Rust", "Systems Programming"],
      status: "active",
      created_at: "2024-04-10",
    },
    {
      id: "9",
      title: "Creative Writing for Digital Marketing",
      description:
        "Published author offering creative writing guidance in exchange for digital marketing knowledge. I can help with storytelling, character development, and plot structure.",
      skills_offered: ["Creative Writing", "Storytelling", "Editing"],
      skills_wanted: ["Digital Marketing", "SEO", "Content Strategy"],
      status: "active",
      created_at: "2024-04-09",
      user: {
        name: "Emma Thompson",
        avatar: "https://github.com/shadcn.png",
      },
    },
    {
      id: "10",
      title: "Looking to exchange UI Design for Mobile Development",
      description:
        "UI designer looking to learn mobile development. I can help with UI/UX design, Figma, and design systems in exchange for mobile development guidance.",
      skills_offered: ["UI Design", "Figma", "Design Systems"],
      skills_wanted: ["React Native", "iOS Development", "Android Development"],
      status: "active",
      created_at: "2024-04-08",
    },
  ],
  requests: [
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
  ],
  chats: [
    {
      id: "chat1",
      post_id: "1",
      participants: ["user1", "user2"],
      messages: [
        {
          id: "msg1",
          chat_id: "chat1",
          sender_id: "user2",
          content:
            "Hi! I'm interested in exchanging Python skills for your React expertise.",
          created_at: "2024-04-17T10:05:00Z",
        },
        {
          id: "msg2",
          chat_id: "chat1",
          sender_id: "user1",
          content:
            "That sounds great! I'd love to learn Python. When would you like to start?",
          created_at: "2024-04-17T10:10:00Z",
        },
      ],
      created_at: "2024-04-17T10:00:00Z",
    },
  ],
  addPost: (post) =>
    set((state) => ({
      posts: [
        {
          ...post,
          id: String(Date.now()),
          created_at: new Date().toISOString().split("T")[0],
          status: "active",
        },
        ...state.posts,
      ],
    })),
  addRequest: (request) =>
    set((state) => ({
      requests: [
        {
          ...request,
          id: String(Date.now()),
          created_at: new Date().toISOString(),
          status: "pending",
        },
        ...state.requests,
      ],
    })),
  updateRequest: (requestId, status) =>
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === requestId ? { ...request, status } : request
      ),
    })),
  addChat: (postId, otherUserId) => {
    const chatId = `chat-${Date.now()}`;
    set((state) => ({
      chats: [
        ...state.chats,
        {
          id: chatId,
          post_id: postId,
          participants: [state.currentUser.id, otherUserId],
          messages: [],
          created_at: new Date().toISOString(),
        },
      ],
    }));
    return chatId;
  },
  addMessage: (chatId, content) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: `msg-${Date.now()}`,
                  chat_id: chatId,
                  sender_id: state.currentUser.id,
                  content,
                  created_at: new Date().toISOString(),
                },
              ],
            }
          : chat
      ),
    })),
}));
