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
import { mockPosts } from "@/lib/mock-data";
import { Post } from "./Post";
import CreatePost from "./CreatePost";

export const PostList = () => {
  return (
    <div className="flex flex-col items-start gap-6 p-6 bg-gray-50 flex-1">
      <div className="flex flex-col w-full max-w-[640px] items-start gap-6">
        <div className="flex flex-col items-start gap-4 w-full">
          {/* New Post Card */}
          <CreatePost />
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
            {mockPosts.map((post) => (
              // スプレッド構文でpostオブジェクトの全てのプロパティを展開
              <Post key={post.id} {...post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
