"use client";
import React from "react";
import { PostList } from "../../components/PostList";
import { Navigation } from "../../components/Navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, userProfile } = useAuth();
  return (
    <AuthGuard>
      <main className="flex flex-row w-full min-h-screen bg-slate-50">
        <div className="flex w-full">
          <Navigation />
          {user && <PostList />}
        </div>
      </main>
    </AuthGuard>
  );
}
