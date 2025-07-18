import React from "react";
import { FeedSection } from "@/components/FeedSection";
import { UserProfileSection } from "@/components/UserProfileSection";

export default function PostDetailPage() {
  return (
    <main className="flex flex-row w-full min-h-screen bg-slate-50">
      <div className="flex w-full">
        <UserProfileSection />
        {/* Post */}
        <div className="flex flex-col items-start gap-4 w-full">
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
        </div>
      </div>
    </main>
  );
}
