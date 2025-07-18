"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { useParams } from "next/navigation";
import { mockPosts } from "@/lib/mock-data";
import { Post } from "@/components/Post";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id;
  // 投稿IDが数値であることを確認
  const post = mockPosts.find((p) => String(p.id) === String(postId));
  console.log("Post ID:", postId, "Post:", post);

  // createdAtがDateでなかった場合の対処
  // 文字列や数値からDateオブジェクトに変換する関数
  // もしDateオブジェクトであればそのまま返す
  // 文字列や数値であればDateオブジェクトに変換して返す
  // それ以外の型の場合は現在の日付を返す
  // これにより、createdAtが常にDateオブジェクトとして扱える
  const parseDate = (value) => {
    if (value instanceof Date) return value;
    if (typeof value === "string" || typeof value === "number")
      return new Date(value);
    return new Date();
  };
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation />
      {/* Post */}
      <main className="flex-1 pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center mb-6">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-xl font-bold">ホーム</p>
          </div>
          <Post
            id={post.id}
            content={post.content}
            authorId={post.authorId}
            authorName={post.authorName}
            authorUsername={post.authorUsername}
            authorAvatar={post.authorAvatar}
            images={post.images}
            likes={post.likes}
            comments={post.comments}
            createdAt={parseDate(post.createdAt)}
            visibility={post.visibility}
          />
        </div>
      </main>
    </div>
  );
}
