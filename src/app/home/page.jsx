import React from "react";
import { FeedSection } from "../../components/FeedSection";
import { UserProfileSection } from "../../components/UserProfileSection";

export default function HomePage() {
  return (
    <main className="flex flex-row w-full min-h-screen bg-slate-50">
      <div className="flex w-full">
        <UserProfileSection />
        <FeedSection />
      </div>
    </main>
  );
}
