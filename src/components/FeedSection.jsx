import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import React from "react";
import Link from "next/link";

export const FeedSection = () => {
  // Post data for mapping
  const posts = [
    {
      id: 1,
      author: "Jonathan Ive",
      handle: "@jonny",
      time: "2h",
      avatar: "/avatar-3.png",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      author: "Steve Jobs",
      handle: "@jobs",
      time: "2h",
      avatar: "/avatar.png",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      likes: 24,
      comments: 8,
    },
    {
      id: 3,
      author: "Jonathan Ive",
      handle: "@jonny",
      time: "2h",
      avatar: "/image.png",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      likes: 24,
      comments: 8,
    },
  ];

  return (
    <div className="flex flex-col items-start gap-6 p-6 bg-gray-50 flex-1">
      <div className="flex flex-col w-full max-w-[640px] items-start gap-6">
        <div className="flex flex-col items-start gap-4 w-full">
          {/* New Post Card */}
          <Card className="w-full">
            <CardHeader className="pb-0">
              <h2 className="font-text-xl-semibold text-[#020618]">新規投稿</h2>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/avatar-2.png" alt="User avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Textarea
                  className="flex-1 min-h-[80px]"
                  placeholder="いまなにしてる？"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-[#1d9bf0] hover:bg-[#1a8cd8]">投稿</Button>
            </CardFooter>
          </Card>

          {/* Timeline Tabs */}
          <Tabs defaultValue="public" className="w-full">
            <TabsList className="w-full bg-slate-100 p-1">
              <TabsTrigger
                value="public"
                className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                パブリックタイムライン
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1 text-[#62748e]">
                フォロー中
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Posts */}
          <div className="flex flex-col items-start gap-4 w-full">
            {posts.map((post) => (
              <Link href={`/post/${post.id}`}>
                <Card key={post.id} className="w-full p-5">
                  <div className="flex items-center justify-between w-full mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.avatar} alt={post.author} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-text-base-semibold text-[#020618] whitespace-nowrap">
                            {post.author}
                          </span>
                          <span className="font-text-sm-normal text-[#62748e] whitespace-nowrap">
                            {post.handle}
                          </span>
                          <span className="font-text-sm-normal text-[#62748e] whitespace-nowrap">
                            {post.time}
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-slate-50 text-[#1d9bf0] border-[#1d9bf0] opacity-80 rounded-2xl"
                          >
                            Public
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>

                  <p className="font-text-sm-normal text-[#314158] mb-4">
                    {post.content}
                  </p>

                  <div className="h-[200px] bg-gray-100 rounded-lg w-full mb-4" />

                  <div className="flex items-center justify-end gap-4 w-full">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-500 text-sm">
                        {post.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-500 text-sm">
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
