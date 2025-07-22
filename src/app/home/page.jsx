"use client";
import React from "react";
import { PostList } from "../../components/PostList";
import { Navigation } from "../../components/Navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { usePosts } from "@/lib/posts-context";

export default function HomePage() {
  const { user, userProfile } = useAuth();
  const { posts, loading } = usePosts();
  return (
    <AuthGuard>
      <main className="flex flex-row w-full min-h-screen bg-slate-50">
        <div className="flex flex-row-reverse w-full items-start">
          {user && <PostList posts={posts} />}
          <Navigation />
        </div>
      </main>
    </AuthGuard>
  );
}
