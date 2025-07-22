"use client";

import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useParams } from "next/navigation";
// import { mockPosts } from "@/lib/mock-data";
import { Post } from "@/components/Post";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import { usePosts } from "@/lib/posts-context";

export default function PostDetailPage() {
  // コンテキストから全投稿を取得
  const { posts } = usePosts();
  const params = useParams();
  const postId = params.id;
  // 投稿IDが数値であることを確認
  // const post = mockPosts.find((p) => String(p.id) === String(postId));
  // console.log("Post ID:", postId, "Post:", post);
  const { user, userProfile } = useAuth();

  // State管理
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);

  // Firestore Timestampを安全にDateに変換する関数
  // const convertTimestamp = (timestamp) => {
  //   if (!timestamp) return null;

  //   // Reactのコンポーネントを定義しています
  //   if (timestamp && typeof timestamp.toDate === "function") {
  //     return timestamp.toDate();
  //   }

  //   if (timestamp instanceof Date) {
  //     return timestamp;
  //   }

  //   if (timestamp) {
  //     const date = new Date(timestamp);
  //     return isNaN(date.getTime()) ? null : date;
  //   }

  //   return null;
  // };

  // 投稿時間の表示用フォーマット
  // const formatTimestamp = (timestamp) => {
  //   const date = convertTimestamp(timestamp);
  //   if (!date) return "now";

  //   const now = new Date();
  //   const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  //   const diffInHours = Math.floor(diffInMinutes / 60);
  //   const diffInDays = Math.floor(diffInHours / 24);

  //   if (diffInMinutes < 1) return "now";
  //   if (diffInMinutes < 60) return `${diffInMinutes}m`;
  //   if (diffInHours < 24) return `${diffInHours}h`;
  //   if (diffInDays < 7) return `${diffInDays}d`;
  //   return date.toLocaleDateString();
  // };
  useEffect(() => {
    // console.log("useEffect実行: postId=", postId);
    // console.log("postsの中身:", posts);
    if (postId && posts.length > 0) {
      const post = posts.find((p) => String(p.id) === String(postId));
      // console.log("postの中身:", post);
      setPostData(post);
      setLoading(false); // ← ここも忘れずに
    }
  }, [postId, posts]);

  if (!postData) {
    return <p>データがありません</p>;
  }

  return (
    <AuthGuard>
      <main className="flex flex-row w-full min-h-screen bg-slate-50 py-20 md:py-0">
        <div className="flex flex-row-reverse w-full items-start">
          <div className="flex flex-col items-start gap-6 p-6 bg-gray-50 flex-1">
            <div className="flex flex-col w-full max-w-4xl items-start gap-6">
              {/* <BackButton /> */}
              {/* Post */}
              <Post
                id={postData.id}
                content={postData.content}
                authorId={postData.authorId}
                authorName={postData.authorName}
                authorUsername={postData.authorUsername}
                authorAvatar={postData.authorAvatar}
                images={postData.images}
                likes={postData.likes}
                comments={postData.comments}
                createdAt={postData.createdAt}
                visibility={postData.visibility}
              />
            </div>
          </div>
          <Navigation />
        </div>
      </main>
    </AuthGuard>
  );
}
