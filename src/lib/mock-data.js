// lib/mock-data.js
export const mockUsers = [
  {
    id: "user1",
    name: "田中太郎",
    username: "tanaka_taro",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Web開発者です。React/Next.jsが好きです。",
    followers: 150,
    following: 80,
    createdAt: "2023-01-15",
  },
  {
    id: "user2",
    name: "佐藤花子",
    username: "sato_hanako",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "デザイナー兼エンジニア。UI/UXに興味があります。",
    followers: 200,
    following: 120,
    createdAt: "2023-02-20",
  },
];

export const mockPosts = [
  {
    id: 1,
    content:
      "今日は新しいReactプロジェクトを始めました！Next.js 14を使ってSNSアプリを作っています。",
    authorId: "user1",
    authorName: "田中太郎",
    authorUsername: "tanaka_taro",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    images: [],
    likes: ["user2"],
    comments: [],
    createdAt: new Date("2024-01-15T10:30:00"),
    visibility: "public",
  },
  {
    id: 2,
    content:
      "UIデザインの新しいトレンドについて調べています。ミニマルデザインが人気ですね。",
    authorId: "user2",
    authorName: "佐藤花子",
    authorUsername: "sato_hanako",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    images: ["/placeholder.svg?height=200&width=300"],
    likes: ["user1"],
    comments: [],
    createdAt: new Date("2024-01-15T14:20:00"),
    visibility: "public",
  },
];
